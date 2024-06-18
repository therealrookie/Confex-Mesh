import React, { useState, useRef, useEffect } from "react";
import { EditIcon } from "../assets/icons";
import styled from "styled-components";

const EditIconStyled = styled(EditIcon)`
  visibility: hidden;
  cursor: pointer;
  margin-right: 5px;
`;

const TimelineHeading = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  &:hover ${EditIconStyled} {
    visibility: ${(props) => (props.$isEditing ? "hidden" : "visible")};
  }
`;

const StyledInput = styled.input`
  text-align: ${(props) => (props.$isEditing ? "left" : "center")};
  border-radius: 8px;
  padding: 4px;
  margin: 1px;
  margin-left: 20px;
  width: 78%; // Adjust width as needed
  height: 100%;
  border: ${(props) => (props.$isEditing ? "1px solid black" : "none")};
  background-color: ${(props) => (props.$isEditing ? "white" : "transparent")};
  color: black;
  pointer-events: ${(props) => (props.$isEditing ? "auto" : "none")};
`;

const TimelineName = ({ handle, name, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(name);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleNameChange = (e) => {
    setEditName(e.target.value);
  };

  const handleSave = () => {
    onSave(handle, editName);
    setIsEditing(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSave();
      inputRef.current.blur();
    }
  };

  return (
    <TimelineHeading $isEditing={isEditing}>
      <EditIconStyled onClick={handleEdit} />
      <StyledInput
        ref={inputRef}
        type="text"
        value={editName}
        onChange={handleNameChange}
        onBlur={handleSave}
        onKeyPress={handleKeyPress}
        readOnly={!isEditing}
        $isEditing={isEditing}
        autoFocus={isEditing}
      />
    </TimelineHeading>
  );
};

export default TimelineName;
