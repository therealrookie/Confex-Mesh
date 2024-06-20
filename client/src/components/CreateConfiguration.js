import React, { useState, useRef } from "react";
import "../sass/configuration.css";
import styled from "styled-components";
import { newTimeline } from "../services/createTimeline";
import { useQuery } from "@tanstack/react-query";
import { getPlayers } from "../services/database";
import RatioTabs from "./RatioTabs";

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 20px;
`;

const PlayerContainer = styled.div`
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
  display: flex;
  flex-direction: column;
`;

const ZoneContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const ZoneShape = styled.div`
  position: relative;
  border: 1px solid #000;
  border-radius: 4px;
  margin: 10px 10px;
  background-color: #e0e0e0;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
  width: ${(props) => (50 * props.$ratioWidth) / props.$ratioHeight}px; /* Calculate width based on ratio */
`;

const ZoneText = styled.div`
  position: absolute;
  text-align: center;
  white-space: nowrap;
`;
const ComponentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center:
`;

const ScreenContainer = styled.div`
  width: 800px;
  border: 2px dashed #ccc;
  height: 50px;
  margin: 20px 0; /* Just to separate the screen and the shapes */
  position: relative;
`;

const ShapeContainer = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center:

`;

const CreateConfiguration = () => {
  const [activeTab, setActiveTab] = useState("144:9");
  const [draggingShape, setDraggingShape] = useState(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isOverScreenContainer, setIsOverScreenContainer] = useState(false);

  const playersQuery = useQuery({
    queryKey: ["players"],
    queryFn: getPlayers,
  });

  const handleMouseMove = (event) => {
    event.preventDefault();
    if (draggingShape) {
      const copy = document.getElementById("draggingShapeCopy");
      const screenContainer = document.getElementById("screenContainer");

      if (copy && screenContainer) {
        const { clientX, clientY } = event;
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        copy.style.left = `${clientX + scrollLeft - copy.offsetWidth / 2}px`;
        copy.style.top = `${clientY + scrollTop - copy.offsetHeight / 2}px`;

        const containerRect = screenContainer.getBoundingClientRect();
        if (
          clientX >= containerRect.left &&
          clientX <= containerRect.right &&
          clientY >= containerRect.top &&
          clientY <= containerRect.bottom
        ) {
          setIsOverScreenContainer(true);
        } else {
          setIsOverScreenContainer(false);
        }
      }
    }
  };

  const handleMouseUp = (event) => {
    if (draggingShape) {
      const copy = document.getElementById("draggingShapeCopy");
      if (isOverScreenContainer && copy) {
        const screenContainer = document.getElementById("screenContainer");
        const containerRect = screenContainer.getBoundingClientRect();
        const { clientX, clientY } = event;
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // Calculate position relative to ScreenContainer
        const left = clientX + scrollLeft - containerRect.left - copy.offsetWidth / 2;
        const top = clientY + scrollTop - containerRect.top - copy.offsetHeight / 2;

        copy.style.left = `${left}px`;
        copy.style.top = `${top}px`;
        copy.style.position = "absolute";

        // Append the copy to the ScreenContainer
        screenContainer.appendChild(copy);
      } else if (copy) {
        copy.remove();
      }
      setDraggingShape(null);
    }
  };

  const handleMouseDown = (event, player, zone, ratio) => {
    event.preventDefault();

    setOffset({
      x: event.clientX,
      y: event.clientY,
    });

    const shapeCopy = document.createElement("div");
    shapeCopy.id = "draggingShapeCopy";
    shapeCopy.style.position = "absolute";
    shapeCopy.style.width = `${(50 * parseInt(ratio.split(":")[0], 10)) / parseInt(ratio.split(":")[1], 10)}px`;
    shapeCopy.style.height = "50px";
    shapeCopy.style.backgroundColor = "#e0e0e0";
    shapeCopy.style.border = "1px solid #000";
    shapeCopy.style.borderRadius = "4px";
    shapeCopy.style.display = "flex";
    shapeCopy.style.justifyContent = "center";
    shapeCopy.style.alignItems = "center";
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    shapeCopy.style.left = `${event.clientX + scrollLeft - shapeCopy.offsetWidth / 2}px`;
    shapeCopy.style.top = `${event.clientY + scrollTop - shapeCopy.offsetHeight / 2}px`;
    shapeCopy.textContent = `Zone ${zone}: ${ratio}`;
    shapeCopy.dataset.playerId = player.id;
    shapeCopy.dataset.zone = zone;
    shapeCopy.dataset.ratio = ratio;

    document.body.appendChild(shapeCopy);
    setDraggingShape(shapeCopy);
  };

  const handleMouseEnter = () => {
    setIsOverScreenContainer(true);
    console.log("TRUE");
  };

  const handleMouseLeave = () => {
    setIsOverScreenContainer(false);
    console.log("FALSE");
  };

  React.useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [draggingShape]);

  const matchingPlayers = (playerRatio) => {
    if (!playersQuery.data) return null;

    const filteredPlayers = playersQuery.data.filter((player) => Object.values(player.zones).includes(playerRatio));

    return (
      <Container>
        {filteredPlayers.length > 0 ? (
          filteredPlayers.map((player) => (
            <PlayerContainer key={player.id}>
              <h4>{player.name}</h4>
              <ZoneContainer>
                {Object.entries(player.zones).map(
                  ([zone, ratio]) =>
                    ratio === playerRatio && (
                      <ZoneShape
                        key={zone}
                        $ratioWidth={parseInt(ratio.split(":")[0], 10)}
                        $ratioHeight={parseInt(ratio.split(":")[1], 10)}
                        onMouseDown={(event) => handleMouseDown(event, player, zone, ratio)}
                      >
                        <ZoneText>
                          Zone {zone}: {ratio}
                        </ZoneText>
                      </ZoneShape>
                    )
                )}
              </ZoneContainer>
            </PlayerContainer>
          ))
        ) : (
          <p>No players with matching ratios found.</p>
        )}
      </Container>
    );
  };

  return (
    <div>
      <h1>Matrix Configuration</h1>
      <ScreenContainer
        id="screenContainer"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      ></ScreenContainer>
      <RatioTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      <ComponentContainer>{matchingPlayers(activeTab)}</ComponentContainer>
      <button className="btn btn-danger" id="cancelButton">
        Cancel
      </button>
      <button
        className="btn btn-success"
        id="saveButton"
        onClick={() => {
          newTimeline();
        }}
      >
        Save
      </button>
    </div>
  );
};

export default CreateConfiguration;

/*

  // State for shapes that can be dragged into the ScreenContainer
  const [shapes, setShapes] = useState([
    { id: "shape-2", ratio: "16:9" },
    { id: "shape-4", ratio: "32:9" },
    { id: "shape-5", ratio: "64:9" },
    { id: "shape-6", ratio: "144:9" },
  ]);

      <ComponentContainer>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="screenContainer" isDropDisabled={true}>
            {(provided, snapshot) => (
              <ScreenContainer
                ref={provided.innerRef}
                {...provided.droppableProps}
                isDraggingOver={snapshot.isDraggingOver.toString()}
              >
                {provided.placeholder}
              </ScreenContainer>
            )}
          </Droppable>
          <Droppable droppableId="shapeContainer" direction="horizontal">
            {(provided, snapshot) => (
              <ShapeContainer ref={provided.innerRef} {...provided.droppableProps}>
                {shapes.map((shape, index) => (
                  <Shape key={shape.id} id={shape.id} ratio={shape.ratio} index={index} />
                ))}
                {provided.placeholder}
              </ShapeContainer>
            )}
          </Droppable>
        </DragDropContext>
      </ComponentContainer>


*/
