// Currently selected / played Matrix
// Is shown on the Main page

import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import styled from "styled-components";
import Layer from "../../Configuration/components/Layer";
import { usePlayingMatrix } from "../../../context/PlayingMatrixContext";
import { getZonesFromMatrixId } from "../../../services/database";
import LayerPlayingMatrix from "./LayerPlayingMatrix";

const MatrixContainer = styled.div`
  position: relative;
  width: 80%;
  height: 50px;
  cursor: pointer;
  margin-bottom: 10px; // Add some spacing
  background-color: #f0f0f0;
`;

const SelectedMatrix = () => {
  const { playingMatrix, setPlayingMatrix, updatePlayingMatrix } = usePlayingMatrix();

  const zonesQuery = useQuery({
    queryKey: ["zones", playingMatrix?.matrix_id],
    queryFn: () => getZonesFromMatrixId(playingMatrix.matrix_id),
    enabled: !!playingMatrix?.matrix_id,
  });

  if (zonesQuery.isLoading) {
    return <p>loading ...</p>;
  }

  if (zonesQuery.isError) {
    return <pre>{JSON.stringify(zonesQuery.error)}</pre>;
  }

  return (
    <div className="w-100 d-flex justify-content-center">
      <MatrixContainer className={`${!playingMatrix && "d-flex justify-content-center align-items-center"}`}>
        {playingMatrix != null ? (
          zonesQuery.data.map((zone, index) => <LayerPlayingMatrix key={index} zone={zone} />)
        ) : (
          <p>No matrix playing at the moment</p>
        )}
      </MatrixContainer>
    </div>
  );
};

export default SelectedMatrix;

/**
         const zonesQuery = useQuery({
    queryKey: ["zones", playingMatrix.matrix_id],
    enabled: playingMatrix != null,
    queryFn: () => getZonesFromMatrixId(playingMatrix.matrix_id),
  });

  if (zonesQuery.isLoading) {
    return <p>loading ...</p>;
  }

  if (zonesQuery.isError) {
    return <pre>{JSON.stringify(zonesQuery.error)}</pre>;
  }

  if (!zonesQuery.data) {
    return <p>No layers available</p>;
  }


        {playingMatrix != null && zonesQuery.data.map((zone, index) => <Layer key={index} zone={zone} />)}



 */
