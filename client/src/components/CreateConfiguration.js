import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import "../sass/configuration.css";
import styled from "styled-components";
import { newTimeline } from "../services/createTimeline";
import { useQuery } from "@tanstack/react-query";
import { addMatrix, getPlayers, addZone } from "../services/database";
import RatioTabs from "./RatioTabs";
import { getSnapPosition, clientInsideRect } from "../services/matrixConfigFunctions";
import { json } from "react-router-dom";
import {
  Container,
  PlayerContainer,
  ZoneContainer,
  ZoneShape,
  ZoneText,
  ComponentContainer,
  ScreenContainer,
  DraggableShape,
} from "../services/StyledComponents";
import DragShapeContainer from "./DragShapeContainer";

const CreateConfiguration = () => {
  const [activeTab, setActiveTab] = useState("144:9");
  const [shapes, setShapes] = useState([]); // State to track shapes
  const [edit, setEdit] = useState("edit");
  const [name, setName] = useState("");

  const playersQuery = useQuery({
    queryKey: ["players"],
    queryFn: getPlayers,
  });

  const allowDrop = (event) => {
    event.preventDefault();
  };

  const drag = (event, player, zone, ratio) => {
    const dragData = JSON.stringify({ player: player.name, playerId: player.player_id, zone, ratio });
    console.log("DRAGDATA: ", dragData);
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
    console.log("EVENT: ", textData);

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
    console.log("DATA: ", data);
    return {
      id: createRandomId(),
      ratioWidth: ratioArray[0], // i.e. 64
      ratioHeight: ratioArray[1], // i.e. 9
      top: 0,
      left: calcLeftPosOfShape(event, ratioArray),
      zone: data.zone,
      player: data.player, // Add the player's name to the shape data
      playerId: data.playerId,
    };
  }

  const handleExternalDrop = (event, data) => {
    const newShape = getNewShapeData(event, data);

    setShapes((prevShapes) => [...prevShapes, newShape]);
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
  };

  async function newMatrix() {
    const matrixData = await addMatrix(0, name);
    console.log(matrixData);

    shapes.map((shape) => {
      console.log("SHAPE: ", shape);
      addZone({
        matrixId: matrixData.matrix.matrix_id,
        playerId: shape.playerId,
        layerHandle: 0,
        posLeft: shape.left,
        section: shape.zone,
      });
    });
    const zoneData = clearShapes();
  }

  const clearShapes = () => {
    setName("");
    setEdit("edit");
    setShapes([]); // Clear the shapes state as well
    setActiveTab("144:9");
  };

  const matchingPlayers = (playerRatio) => {
    if (!playersQuery.data) return null;

    const filteredPlayers = playersQuery.data.filter((player) => Object.values(player.sections).includes(playerRatio));

    return (
      <DragShapeContainer filteredPlayers={filteredPlayers} playerRatio={playerRatio} drag={drag} setEdit={setEdit} />
    );
  };

  return (
    <div>
      <h1>Matrix Configuration</h1>
      <p>Drag and drop zones on the Matrix.</p>
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
            <div>{shape.player}</div>
          </DraggableShape>
        ))}
      </ScreenContainer>
      {edit === "edit" && (
        <ComponentContainer>
          <RatioTabs activeTab={activeTab} setActiveTab={setActiveTab} />
          {matchingPlayers(activeTab)}
          <button
            className="btn btn-danger"
            onClick={() => {
              setEdit("cancel");
            }}
          >
            Cancel
          </button>
          <button
            className="btn btn-success"
            onClick={() => {
              setEdit("save");
            }}
          >
            Save
          </button>
        </ComponentContainer>
      )}
      {edit === "cancel" && (
        <div>
          <h4>Discard the current Matrix</h4>
          <p>Do you really want to delete the Matrix</p>
          <button
            className="btn btn-success"
            onClick={() => {
              setEdit("edit");
            }}
          >
            No
          </button>
          <button
            className="btn btn-danger"
            onClick={() => {
              clearShapes();
            }}
          >
            Yes
          </button>
        </div>
      )}
      {edit === "save" && (
        <div>
          <h4>Save the current Matrix</h4>
          <p>Do you really want to save this Matrix</p>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />{" "}
          <button
            className="btn btn-danger"
            onClick={() => {
              setEdit("edit");
            }}
          >
            No
          </button>
          <button
            className="btn btn-success"
            onClick={() => {
              newMatrix();
            }}
            disabled={name === ""}
          >
            Yes
          </button>
        </div>
      )}
    </div>
  );
};

export default CreateConfiguration;
