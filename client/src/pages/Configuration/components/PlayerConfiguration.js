import React from "react";
import styled from "styled-components";
import InputData from "./InputData";
import PlayerName from "./PlayerName";
import SectionsContainer from "./SectionsContainer";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getInputs, setInputName } from "../../../services/api";
import { getPlayers, updatePlayer } from "../../../services/database";

const GridContainer = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(4, 1fr); /* Define 4 columns */
  gap: 10px; /* Gap between grid items */
`;

const PlayerContainer = styled.div`
  background-color: #f0f0f0;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  margin: 0px 0;
  grid-column: span ${(props) => props.span};
`;

const getSizeFromRatio = (ratio) => {
  switch (ratio) {
    case "144:9":
      return 4; // Full width (spans all 4 columns)
    case "64:9":
    case "32:9":
      return 2; // Half width (spans 2 columns)
    case "16:9":
      return 1; // Quarter width (spans 1 column)
    default:
      return 1; // Default to quarter width
  }
};

const getLargestRatio = (sections) => {
  const ratios = Object.values(sections);
  if (ratios.includes("144:9")) return "144:9";
  if (ratios.includes("64:9")) return "64:9";
  if (ratios.includes("32:9")) return "32:9";
  if (ratios.includes("16:9")) return "16:9";
  return "16:9";
};

const PlayerConfiguration = () => {
  const queryClient = useQueryClient();

  const inputsQuery = useQuery({
    queryKey: ["inputs"],
    enabled: true,
    queryFn: () => getInputs(),
  });

  const playersQuery = useQuery({
    queryKey: ["players"],
    enabled: true,
    queryFn: () => getPlayers(),
  });

  const playersMutation = useMutation({
    mutationFn: (data) => updatePlayer(data),
    onSuccess: (data) => {
      queryClient.setQueryData(["players", data.player_id], data);
      queryClient.invalidateQueries(["players", { exact: true }]);
    },
  });

  // Update players-table
  const handleSubmit = (playerId, name, input, resourceHandle) => {
    playersMutation.mutate({
      playerId: playerId,
      name: name,
      input: input,
      resourceHandle: resourceHandle,
    });
  };

  // Handle update of Player-name
  const handleSaveName = async (playerId, newName) => {
    const player = playersQuery.data.find((player) => player.player_id === playerId);
    handleSubmit(playerId, newName, player.input, player.resource_handle);
  };

  const updatePlayerInput = async (playerId, newInput) => {
    const player = playersQuery.data.find((player) => player.player_id === playerId);

    // Change Resource-name inside Pixera
    const answer = await setInputName(newInput.handle, newInput.name);

    // Change name inside players-table
    handleSubmit(playerId, player.name, newInput.name, newInput.handle);
  };

  return (
    <>
      <h1>Player Configuration</h1>
      <GridContainer className="container text-center">
        {playersQuery.isLoading && <div className="spinner-border" role="status"></div>}
        {playersQuery.isError && <span className="badge text-light text-bg-danger">Players not available</span>}
        {playersQuery.data &&
          playersQuery.data.map((player) => {
            const largestRatio = getLargestRatio(player.sections);
            const span = getSizeFromRatio(largestRatio);

            return (
              <PlayerContainer key={player.player_id} span={span}>
                <PlayerName name={player.name} onSave={(newName) => handleSaveName(player.player_id, newName)} />
                <SectionsContainer sections={player.sections} />
                <div className="d-flex">
                  {inputsQuery.isLoading && <div className="spinner-border" role="status"></div>}
                  {inputsQuery.isError && <span className="badge text-light text-bg-danger">Input not available</span>}
                  {inputsQuery.data && (
                    <InputData
                      inputs={inputsQuery.data}
                      player={player}
                      onUpdateInput={(newInput) => updatePlayerInput(player.player_id, newInput)}
                    />
                  )}
                </div>
              </PlayerContainer>
            );
          })}
      </GridContainer>
    </>
  );
};

export default PlayerConfiguration;
