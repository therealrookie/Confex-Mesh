import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useEditMatrix } from "../context/EditMatrixContext";
import { useEditLayer } from "../context/EditLayerContext";
import { getLayerData, createLayer, removeLayer } from "../services/api";
import { getPlayers } from "../services/database";
import styled from "styled-components";
import { cropFactors, scale } from "../services/calculations";
import { newLayerValues } from "../services/layerCalculations";

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
// handle: Timeline Handle\/
const EditInputs = ({ timelineHandle }) => {
  const queryClient = useQueryClient();
  const { editLayer } = useEditLayer();

  const layerQuery = useQuery({
    queryKey: ["layer", editLayer?.handle],
    queryFn: () => getLayerData(editLayer?.handle),
    enabled: !!editLayer?.handle,
  });

  const playersQuery = useQuery({
    queryKey: ["players"],
    queryFn: getPlayers,
  });

  const removeLayerMutation = useMutation({
    mutationFn: (handle) => {
      return removeLayer(handle);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["layers", timelineHandle]);
    },
  });

  const createLayerMutation = useMutation({
    mutationFn: (newLayerData) => {
      return createLayer(timelineHandle, newLayerData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["layers", timelineHandle]);
    },
  });

  const replaceInput = async (playerIndex, zone) => {
    const player = playersQuery.data.find((player) => player.id === playerIndex);
    const { left, top, widthCSS, heightCSS, ratio } = editLayer.props;

    const { width, height, xPos, yPos, cropLeft, cropRight, cropBottom } = newLayerValues(left, widthCSS, ratio, zone);
    //const { scaleX, scaleY, yPos } = newLayerScale(player.id);

    const newLayerData = {
      timelineHandle: timelineHandle,
      width: width,
      height: height,
      xPos: xPos,
      yPos: yPos,
      resourceID: player.resid[0],
      left: cropLeft,
      right: cropRight,
      top: 0,
      bottom: cropBottom,
      scaleX: 1.0,
      scaleY: 1.0,
    };

    if (editLayer.handle) {
      await removeLayerMutation.mutateAsync(editLayer.handle);
    }

    const newLayer = await createLayerMutation.mutateAsync(newLayerData);
    queryClient.invalidateQueries(["layer", newLayer.layerHandle]);
    window.location.reload();
  };

  if (!editLayer || editLayer.handle == null) {
    return <div>No layer selected for editing.</div>;
  }

  if (layerQuery.isLoading || playersQuery.isLoading) {
    return <p>Loading...</p>;
  }

  if (layerQuery.isError) {
    return <pre>{JSON.stringify(layerQuery.error)}</pre>;
  }

  if (playersQuery.isError) {
    return <pre>{JSON.stringify(playersQuery.error)}</pre>;
  }

  const matchingPlayers = playersQuery.data.filter((player) =>
    Object.values(player.zones).includes(editLayer.props.ratio)
  );

  return (
    <div>
      <h3>Matching Players</h3>
      <Container>
        {matchingPlayers.length > 0 ? (
          matchingPlayers.map((player) => (
            <PlayerContainer key={player.id}>
              <h4>{player.name}</h4>
              <ZoneContainer>
                {Object.entries(player.zones).map(
                  ([zone, ratio]) =>
                    ratio === editLayer.props.ratio && (
                      <ZoneShape
                        key={zone}
                        ratioWidth={parseInt(ratio.split(":")[0], 10)}
                        ratioHeight={parseInt(ratio.split(":")[1], 10)}
                        onClick={() => {
                          replaceInput(player.id, zone);
                        }}
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
    </div>
  );
};

export default EditInputs;

/*
  const { editMatrix } = useEditMatrix();
*/
