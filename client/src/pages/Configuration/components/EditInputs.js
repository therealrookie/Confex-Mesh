import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useEditMatrix } from "../context/EditMatrixContext";
import { useEditZone } from "../context/EditZoneContext";
import { getPlayers, updateZone, getMatrices } from "../../../services/database";
import { removeLayer } from "../../../services/api";
import styled from "styled-components";
import { Container, PlayerContainer, Players, ZoneContainer, ZoneShape, ZoneText } from "./StyledComponents";
import { createNewLayer } from "../services/createTimeline";

const getSizeFromRatio = (sections) => {
  const ratios = Object.values(sections);
  const largestRatio = Math.max(
    ...ratios.map((ratio) => parseInt(ratio.split(":")[0], 10) / parseInt(ratio.split(":")[1], 10))
  );

  if (ratios.includes("144:9")) return 4;
  if (
    ratios.includes("64:9") ||
    ratios.filter((ratio) => ratio === "32:9").length >= 2 ||
    ratios.filter((ratio) => ratio === "16:9").length >= 4
  )
    return 2;
  if (ratios.includes("32:9") || ratios.filter((ratio) => ratio === "16:9").length >= 2) return 1;
  return 1;
};

// handle: Timeline Handle\/
const EditInputs = ({ matrixId }) => {
  const [zoneBody, setZoneBody] = useState();
  const queryClient = useQueryClient();
  const { editZone, setEditZone } = useEditZone(); // editZone: { zoneId, matrixId, playerId, layerHandle, section, ratio, timelineHandle, left }

  const playersQuery = useQuery({
    queryKey: ["players"],
    queryFn: getPlayers,
  });

  const matrixQuery = useQuery({
    queryKey: ["matrices"],
    queryFn: async () => {
      return getMatrices();
    },
    onError: (error) => {
      console.error("Error fetching matrices:", error);
    },
  });
  /*
  const zoneMutation = useMutation({
    mutationFn: () => updateZone(zoneBody), // zoneBody: { playerId, layerHandle, section, zoneId }
    onSuccess: () => {
      queryClient.invalidateQueries(["zone", zoneBody.zoneId]);
    },
  });
*/

  const updateTimeline = async (playerId, section) => {
    console.log("EDITZONE: ", editZone);
    const removed = await removeLayer(editZone.layerHandle);
    const player = playersQuery.data.find((player) => player.player_id === playerId);
    const matrix = matrixQuery.data.find((matrix) => matrix.matrix_id === editZone.matrixId);

    const layerHandle =
      removed && (await createNewLayer(parseInt(matrix.timeline_handle), editZone.left, player, section));
    return parseInt(layerHandle);
  };

  const updateZones = async (playerId, section, layerHandle) => {
    console.log("HERE");
    const body = {
      playerId: playerId,
      layerHandle: layerHandle,
      section: section,
      zoneId: editZone.zoneId,
    };
    await updateZone(body);
  };

  const replaceInput = async (playerId, section) => {
    const layerHandle = await updateTimeline(playerId, section);
    await updateZones(playerId, section, layerHandle);

    setEditZone({
      zoneId: null,
      matrixId: null,
      playerId: null,
      layerHandle: null,
      section: null,
      ratio: null,
      left: null,
    });
    window.location.reload();
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

  const filteredPlayers = playersQuery.data.filter((player) => {
    const sectionValues = Object.values(player.sections);
    const matchFound = sectionValues.includes(editZone.ratio);
    return matchFound;
  });

  return (
    <Players>
      {filteredPlayers.length > 0 ? (
        filteredPlayers.map((player) => {
          const span = getSizeFromRatio(player.sections);
          return (
            <PlayerContainer key={player.playerId} span={span}>
              <h4>{player.name}</h4>
              <ZoneContainer>
                {Object.entries(player.sections).map(
                  ([section, ratio]) =>
                    ratio === editZone.ratio && (
                      <ZoneShape
                        onClick={() => {
                          replaceInput(player.player_id, section);
                        }}
                        key={section}
                        playerId={player.playerId}
                        $ratioWidth={parseInt(ratio.split(":")[0], 10)}
                        $ratioHeight={parseInt(ratio.split(":")[1], 10)}
                      >
                        <ZoneText>Zone {section}</ZoneText>
                      </ZoneShape>
                    )
                )}
              </ZoneContainer>
            </PlayerContainer>
          );
        })
      ) : (
        <p>No players with matching ratios found.</p>
      )}
    </Players>
  );
};

export default EditInputs;

/*
  const { editMatrix } = useEditMatrix();


  const PlayerContainer = styled.div`
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
  display: flex;
  flex-direction: column;
`;

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 20px;
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
  width: ${(props) => (50 * props.$ratioWidth) / props.$ratioHeight}px; 
  `;

  const ZoneText = styled.div`
    position: absolute;
    text-align: center;
    white-space: nowrap;
  `;
  


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

*/
