import React, { useState } from "react";
import { EditIcon } from "../assets/icons";
import styled from "styled-components";

const EditIconStyled = styled(EditIcon)`
  visibility: hidden;
  cursor: pointer; // Makes the cursor a pointer when hovering over the icon
`;

const PlayerHeading = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  &:hover ${EditIconStyled} {
    visibility: visible;
  }
`;

const StyledInput = styled.input`
  border-radius: 8px; // Adds rounded corners to the input field
  padding: 5px; // Optional: Adds padding inside the input
  margin-top: 5px;
`;

const PlayerName = ({ name, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(name);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleNameChange = (e) => {
    setEditName(e.target.value);
  };

  const handleSave = () => {
    onSave(editName);
    setIsEditing(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSave();
    }
  };

  return (
    <PlayerHeading>
      {isEditing ? (
        <StyledInput
          type="text"
          value={editName}
          onChange={handleNameChange}
          onBlur={handleSave}
          onKeyPress={handleKeyPress}
          autoFocus
        />
      ) : (
        <>
          <EditIconStyled className="me-2" onClick={handleEdit} />
          <h3 className="user-select-none">{name}</h3>
        </>
      )}
    </PlayerHeading>
  );
};

export default PlayerName;
