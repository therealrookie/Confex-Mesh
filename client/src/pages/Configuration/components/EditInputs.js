import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useEditMatrix } from "../context/EditMatrixContext";
import { useEditZone } from "../context/EditZoneContext";
import { getPlayers, updateZone } from "../../../services/database";
import styled from "styled-components";

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
  width: ${(props) => (50 * props.$ratioWidth) / props.$ratioHeight}px; /* Calculate width based on ratio */
`;

const ZoneText = styled.div`
  position: absolute;
  text-align: center;
  white-space: nowrap;
`;
// handle: Timeline Handle\/
const EditInputs = ({ matrixId }) => {
  const [zoneBody, setZoneBody] = useState();
  const queryClient = useQueryClient();
  const { editZone, setEditZone } = useEditZone(); // editZone: { zoneId, matrixId, playerId, layerHandle, section, ratio }

  const playersQuery = useQuery({
    queryKey: ["players"],
    queryFn: getPlayers,
  });

  const zoneMutation = useMutation({
    mutationFn: () => updateZone(zoneBody), // zoneBody: { playerId, layerHandle, section, zoneId }
    onSuccess: () => {
      queryClient.invalidateQueries(["zone", zoneBody.zoneId]);
    },
  });

  const replaceInput = (playerId, section) => {
    zoneMutation.mutate();
    setZoneBody({
      playerId: playerId,
      layerHandle: editZone.layerHandle,
      section: section,
      zoneId: editZone.zoneId,
    });
    setEditZone({ zoneId: null, matrixId: null, playerId: null, layerHandle: null, section: null, ratio: null });
  };

  if (editZone.zoneId === null) {
    return <div>Select a Zone to edit...</div>;
  }

  if (playersQuery.isLoading) {
    return <p>Loading...</p>;
  }

  if (playersQuery.isError) {
    return <pre>{JSON.stringify(playersQuery.error)}</pre>;
  }

  const matchingPlayers = playersQuery.data.filter((player) => {
    const sectionValues = Object.values(player.sections);
    const matchFound = sectionValues.includes(editZone.ratio);
    console.log("player.sections: ", player.sections);
    console.log("ratio: ", editZone.ratio);
    console.log("matchFound: ", matchFound);
    return matchFound;
  });

  return (
    <div>
      <Container>
        {matchingPlayers.length > 0 ? (
          matchingPlayers.map((player) => (
            <PlayerContainer key={player.player_id}>
              <h4>{player.name}</h4>
              <ZoneContainer>
                {Object.entries(player.sections).map(
                  ([section, ratio]) =>
                    ratio === editZone.ratio && (
                      <ZoneShape
                        key={section}
                        $ratioWidth={parseInt(ratio.split(":")[0])}
                        $ratioHeight={parseInt(ratio.split(":")[1])}
                        onClick={() => {
                          replaceInput(player.player_id, section);
                        }}
                      >
                        <ZoneText>
                          Zone {section}: {ratio}
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
