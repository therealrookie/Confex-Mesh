import React from "react";
import styled from "styled-components";
import Task from "./task";
import { Droppable } from "react-beautiful-dnd";

const Container = styled.div`
  margin: 8px;
  border: 1px solid lightgrey;
  border-radius: 2px;
  width: 250px;

  display: flex;
  flex-direction: column;
`;
const Title = styled.h3`
  padding: 8px;
`;
const TaskList = styled.div`
  transition: background-color 0.2s ease;
  padding: 8px;
  background-color: ${(props) => (props.isdraggingover ? "skyblue" : "white")};
  flex-grow: 1;
  min-height: 100px;
`;

function Column({ columnKey, column, tasks }) {
  return (
    <Container>
      <Title>{column.title}</Title>
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <TaskList ref={provided.innerRef} {...provided.droppableProps} isdraggingover={snapshot.isdraggingover}>
            {tasks.map((task, index) => (
              <Task key={task.id} task={task} index={index} />
            ))}
            {provided.placeholder}
          </TaskList>
        )}
      </Droppable>
    </Container>
  );
}

export default Column;
