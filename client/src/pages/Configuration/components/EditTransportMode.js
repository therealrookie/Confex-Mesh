import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PlayIcon, StopIcon } from "../../../assets/icons";
import { usePlayingMatrix } from "../../../context/PlayingMatrixContext";
import { getTransportMode } from "../../../services/api";

const EditTransportMode = ({ timeline, changeTransportMode }) => {
  const { playingMatrix, setPlayingMatrix, updatePlayingMatrix } = usePlayingMatrix();
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    playingMatrix && setIsPlaying(playingMatrix.matrix_id === timeline.matrix_id);
  }, [playingMatrix, timeline]);

  return (
    <div>
      {isPlaying ? (
        <StopIcon
          onClick={() => {
            changeTransportMode(timeline, "setInactive");
          }}
          style={{ cursor: "pointer" }}
        />
      ) : (
        <PlayIcon
          onClick={() => {
            changeTransportMode(timeline, "setActive");
          }}
          style={{ cursor: "pointer" }}
        />
      )}
    </div>
  );
};

export default EditTransportMode;
