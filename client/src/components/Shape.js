import React from "react";
import { Draggable } from "react-beautiful-dnd";
import styled from "styled-components";

const Container = styled.div`
  height: 50px;
  background-color: #eee; /* Just as an example */
  margin: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #ccc;
  aspect-ratio: ${(props) => props.ratio.split(":")[0]} / ${(props) => props.ratio.split(":")[1]};
`;

const Shape = ({ id, ratio, index }) => {
  return (
    <Draggable draggableId={id} index={index}>
      {(provided, snapshot) => (
        <Container
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          ratio={ratio}
          isDragging={snapshot.isDragging.toString()}
        >
          {ratio}
        </Container>
      )}
    </Draggable>
  );
};

export default Shape;
