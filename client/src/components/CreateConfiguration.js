import React, { useState } from "react";
import { createRoot } from "react-dom/client";
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
  height: 52px;
  width: ${(props) => (50 * props.$ratioWidth) / props.$ratioHeight}px; /* Calculate width based on ratio */
  cursor: move;
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
  justify-content: center;
`;

const ScreenContainer = styled.div`
  width: 800px;
  border: 2px dashed #ccc;
  height: 50px;
  margin: 20px 0;
  position: relative;
`;

const DraggableShape = styled.div`
  position: absolute;
  border: 1px solid #000;
  border-radius: 4px;
  background-color: #e0e0e0;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
  cursor: move;
  width: ${(props) => (50 * props.$ratioWidth) / props.$ratioHeight}px;
`;

const CreateConfiguration = () => {
  const [activeTab, setActiveTab] = useState("144:9");
  const [shapes, setShapes] = useState([]); // State to track shapes

  const playersQuery = useQuery({
    queryKey: ["players"],
    queryFn: getPlayers,
  });

  const allowDrop = (event) => {
    event.preventDefault();
  };

  const drag = (event, player, zone, ratio) => {
    const dragData = JSON.stringify({ player, zone, ratio });
    event.dataTransfer.setData("application/json", dragData);
  };

  const dragInsideContainer = (event) => {
    event.dataTransfer.setData("text/plain", event.target.id);
  };

  const drop = (event) => {
    event.preventDefault();
    const jsonData = event.dataTransfer.getData("application/json");
    const textData = event.dataTransfer.getData("text/plain");

    if (jsonData) {
      try {
        const data = JSON.parse(jsonData);
        handleExternalDrop(event, data);
      } catch (error) {
        console.error("Invalid JSON data:", error);
      }
    } else if (textData) {
      handleInternalDrop(event, textData);
    }
  };

  const handleDragEnd = (event, id) => {
    const { clientX, clientY } = event;
    const screenContainer = document.getElementById("screenContainer");
    const containerRect = screenContainer.getBoundingClientRect();
    console.log("CLIENTX: ", clientX, containerRect.left, containerRect.right);
    console.log("CLIENTY: ", clientY, containerRect.top, containerRect.bottom);

    if (
      clientX < containerRect.left ||
      clientX > containerRect.right ||
      clientY < containerRect.top ||
      clientY > containerRect.bottom
    ) {
      setShapes((prevShapes) => prevShapes.filter((shape) => shape.id !== id)); // Remove shape if dragged outside
    } else {
      setShapes((prevShapes) =>
        prevShapes.map((shape) =>
          shape.id === id
            ? {
                ...shape,
                left: clientX - containerRect.left - event.target.offsetWidth / 2,
                top: 0,
              }
            : shape
        )
      );
    }
  };

  const handleExternalDrop = (event, data) => {
    const screenContainer = document.getElementById("screenContainer");
    const id = `shape-${Math.random().toString(36).substr(2, 9)}`;
    const left = event.clientX - screenContainer.getBoundingClientRect().left - 25;
    const top = 0;

    const newShape = {
      id,
      ratioWidth: parseInt(data.ratio.split(":")[0], 10),
      ratioHeight: parseInt(data.ratio.split(":")[1], 10),
      left,
      top,
      zone: data.zone,
    };

    setShapes((prevShapes) => [...prevShapes, newShape]);
  };

  const handleInternalDrop = (event, shapeId) => {
    const { clientX, clientY } = event;
    const screenContainer = document.getElementById("screenContainer");
    const containerRect = screenContainer.getBoundingClientRect();

    if (
      clientX < containerRect.left ||
      clientX > containerRect.right ||
      clientY < containerRect.top ||
      clientY > containerRect.bottom
    ) {
      setShapes((prevShapes) => prevShapes.filter((shape) => shape.id !== shapeId)); // Remove shape if dragged outside
    } else {
      const newLeft = clientX - containerRect.left - 25;
      const newTop = 0;
      setShapes((prevShapes) =>
        prevShapes.map((shape) => (shape.id === shapeId ? { ...shape, left: newLeft, top: newTop } : shape))
      );
    }
  };
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
                        draggable
                        onDragStart={(event) => drag(event, player, zone, ratio)}
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
      <ScreenContainer id="screenContainer" onDrop={drop} onDragOver={allowDrop}>
        {shapes.map((shape) => (
          <DraggableShape
            key={shape.id}
            id={shape.id}
            $ratioWidth={shape.ratioWidth}
            $ratioHeight={shape.ratioHeight}
            style={{ left: shape.left, top: shape.top }}
            draggable
            onDragStart={dragInsideContainer}
            onDragEnd={(event) => handleDragEnd(event, shape.id)}
          >
            Zone {shape.zone}: {shape.ratioWidth}:{shape.ratioHeight}
          </DraggableShape>
        ))}
      </ScreenContainer>
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
