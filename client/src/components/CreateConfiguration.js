import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import "../sass/configuration.css";
import styled from "styled-components";
import { newTimeline } from "../services/createTimeline";
import { useQuery } from "@tanstack/react-query";
import { getPlayers } from "../services/database";
import RatioTabs from "./RatioTabs";
import { getSnapPosition, clientInsideRect } from "../services/matrixConfigFunctions";
import { json } from "react-router-dom";

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

    const shape = event.target;
    const rect = shape.getBoundingClientRect();

    // Create an invisible clone of the shape to use as drag image
    const dragImage = shape.cloneNode(true);
    dragImage.style.position = "absolute";
    dragImage.style.top = "-1000px"; // Move it out of view
    document.body.appendChild(dragImage);

    // Set the drag image offset to the center of the shape
    event.dataTransfer.setDragImage(dragImage, rect.width / 2, rect.height / 2);

    // Clean up the drag image after the drag ends
    shape.addEventListener("dragend", () => {
      dragImage.remove();
    });
  };

  const dragInsideContainer = (event) => {
    event.dataTransfer.setData("text/plain", event.target.id);

    const shape = event.target;
    const rect = shape.getBoundingClientRect();

    // Create an invisible clone of the shape to use as drag image
    const dragImage = shape.cloneNode(true);
    dragImage.style.position = "absolute";
    dragImage.style.top = "-1000px"; // Move it out of view
    document.body.appendChild(dragImage);

    // Set the drag image offset to the center of the shape
    event.dataTransfer.setDragImage(dragImage, rect.width / 2, rect.height / 2);

    // Clean up the drag image after the drag ends
    shape.addEventListener("dragend", () => {
      dragImage.remove();
    });
  };

  const drop = (event) => {
    event.preventDefault();
    const jsonData = event.dataTransfer.getData("application/json");
    const textData = event.dataTransfer.getData("text/plain");

    try {
      if (jsonData) {
        handleExternalDrop(event, JSON.parse(jsonData));
      } else if (textData) {
        handleInternalDrop(event, textData);
      }
    } catch (error) {
      console.error("Invalid JSON data:", error);
    }
  };

  const handleDragEnd = (event, id) => {
    const { clientX, clientY } = event;
    const screenContainer = document.getElementById("screenContainer");
    const containerRect = screenContainer.getBoundingClientRect();

    if (clientInsideRect(clientX, clientY, containerRect)) {
      setShapes((prevShapes) => prevShapes.filter((shape) => shape.id !== id)); // Remove shape if dragged outside
    } else {
      setShapes((prevShapes) =>
        prevShapes.map((shape) =>
          shape.id === id
            ? {
                ...shape,
                left: shape.left, //getSnapPosition(clientX - containerRect.left, [shape.ratioWidth, shape.ratioHeight]),
                top: 0,
              }
            : shape
        )
      );
    }
    const thisShape = shapes.find((shape) => shape.id === id);
    console.log("DRAGEND: ", thisShape.left);
  };

  function createRandomId() {
    return `shape-${Math.random().toString(36).substr(2, 9)}`;
  }

  function getScreenContainerRect() {
    const screenContainer = document.getElementById("screenContainer");
    return screenContainer.getBoundingClientRect();
  }

  function getRatioArray(ratio) {
    // i.e. ratio = 64:9
    return [parseInt(ratio.split(":")[0]), parseInt(ratio.split(":")[1])];
  }

  function calcLeftPosOfShape(event, ratioArray) {
    const screenContainerRect = getScreenContainerRect();

    return getSnapPosition(event.clientX - screenContainerRect.left, ratioArray);
  }

  function getNewShapeData(event, data) {
    const ratioArray = getRatioArray(data.ratio); // i.e. [64, 9]

    return {
      id: createRandomId(),
      ratioWidth: ratioArray[0], // i.e. 64
      ratioHeight: ratioArray[1], // i.e. 9
      top: 0,
      left: calcLeftPosOfShape(event, ratioArray),
      zone: data.zone,
    };
  }

  const handleExternalDrop = (event, data) => {
    console.log("EVENT: ", data);
    const newShape = getNewShapeData(event, data);

    setShapes((prevShapes) => [...prevShapes, newShape]);
    console.log("External Drop: ", newShape.left);
  };

  const handleInternalDrop = (event, shapeId) => {
    const { clientX, clientY } = event;
    const screenContainer = document.getElementById("screenContainer");
    const containerRect = screenContainer.getBoundingClientRect();

    const shape = shapes.find((shape) => shape.id === shapeId);
    if (!shape) return;

    if (clientInsideRect(clientX, clientY, containerRect)) {
      setShapes((prevShapes) => prevShapes.filter((shape) => shape.id !== shapeId)); // Remove shape if dragged outside
    } else {
      const newLeft = getSnapPosition(clientX - containerRect.left, [shape.ratioWidth, shape.ratioHeight]);
      const newTop = 0;
      setShapes((prevShapes) =>
        prevShapes.map((shape) => (shape.id === shapeId ? { ...shape, left: newLeft, top: newTop } : shape))
      );
    }
    console.log("Internal Drop: ", shape.left);
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
