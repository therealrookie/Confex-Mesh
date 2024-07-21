import React from "react";
import { PlayIcon, StopIcon } from "../../../assets/icons";

const EditTransportMode = ({ timelineHandle }) => {
  return (
    <div>
      {null === 1 ? (
        <StopIcon
          onClick={() => {
            //handleModal(timeline, "setInactive");
          }}
          style={{ cursor: "pointer" }}
        />
      ) : (
        <PlayIcon
          onClick={() => {
            //handleModal(timeline, "setActive");
          }}
          style={{ cursor: "pointer" }}
        />
      )}
    </div>
  );
};

export default EditTransportMode;
