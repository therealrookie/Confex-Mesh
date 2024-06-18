import React, { useState } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import "../sass/configuration.css";
import styled from "styled-components";
import Shape from "./Shape";
import { newTimeline } from "../services/createTimeline";
import { useQuery } from "@tanstack/react-query";
import { getPlayers } from "../services/database";

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
  width: ${(props) => (50 * props.ratioWidth) / props.ratioHeight}px; /* Calculate width based on ratio */
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
  width: 100%;
  border: 2px dashed #ccc;
  height: 50px;
  margin: 20px 0; /* Just to separate the screen and the shapes */
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

  const playersQuery = useQuery({
    queryKey: ["players"],
    queryFn: getPlayers,
  });

  const matchingPlayers = (ratio) =>
    playersQuery.data.filter((player) => {
      Object.values(player.zones).includes(ratio);

      return (
        <div>
          <Container>
            {matchingPlayers.length > 0 ? (
              matchingPlayers.map((player) => (
                <PlayerContainer key={player.id}>
                  <h4>{player.name}</h4>
                  <ZoneContainer>
                    {Object.entries(player.zones).map(([zone, ratio]) => (
                      //ratio === editLayer.props.ratio && (
                      <ZoneShape
                        key={zone}
                        ratioWidth={parseInt(ratio.split(":")[0], 10)}
                        ratioHeight={parseInt(ratio.split(":")[1], 10)}
                      >
                        <ZoneText>
                          Zone {zone}: {ratio}
                        </ZoneText>
                      </ZoneShape>
                    ))}
                  </ZoneContainer>
                </PlayerContainer>
              ))
            ) : (
              <p>No players with matching ratios found.</p>
            )}
          </Container>
        </div>
      );
    });

  const renderShapes = () => {
    switch (activeTab) {
      case "144:9":
        return <div>Display shapes for 144:9</div>;
      case "64:9":
        return <div>Display shapes for 64:9</div>;
      case "32:9":
        return <div>Display shapes for 32:9</div>;
      case "16:9":
        return <div>Display shapes for 16:9</div>;
      default:
        return null;
    }
  };

  return (
    <div>
      <h1>Matrix Configuration</h1>
      <ScreenContainer></ScreenContainer>
      <ul className="nav nav-tabs nav-justified">
        <li className="nav-item">
          <a className={`nav-link ${activeTab === "144:9" ? "active" : ""}`} onClick={() => setActiveTab("144:9")}>
            144:9
          </a>
        </li>
        <li className="nav-item">
          <a className={`nav-link ${activeTab === "64:9" ? "active" : ""}`} onClick={() => setActiveTab("64:9")}>
            64:9
          </a>
        </li>
        <li className="nav-item">
          <a className={`nav-link ${activeTab === "32:9" ? "active" : ""}`} onClick={() => setActiveTab("32:9")}>
            32:9
          </a>
        </li>
        <li className="nav-item">
          <a className={`nav-link ${activeTab === "16:9" ? "active" : ""}`} onClick={() => setActiveTab("16:9")}>
            16:9
          </a>
        </li>
      </ul>
      <ComponentContainer>
        {renderShapes()}
        {matchingPlayers}
      </ComponentContainer>
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
