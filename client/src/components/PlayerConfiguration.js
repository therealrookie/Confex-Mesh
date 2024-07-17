import React from "react";
import styled from "styled-components";
import InputData from "./InputData";
import PlayerName from "./PlayerName";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getInputs, setInputName } from "../services/api";
import { getPlayers, updatePlayer } from "../services/database";

const PlayerContainer = styled.div`
  width: 100%;
  height: 95%;
  background-color: #f0f0f0;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  margin: 10px 0;
`;

const Section = styled.div`
  margin: 5px;
  padding: 0;
  height: 50px;
  aspect-ratio: ${(props) => props.$ratio};
  background-color: #fff;
  border-radius: 2px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

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
    console.log("PLAYER: ", playerId);
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
      <div className="container text-center">
        {playersQuery.isLoading && <div className="spinner-border" role="status"></div>}
        {playersQuery.isError && <span className="badge text-light text-bg-danger">Players not available</span>}
        {playersQuery.data &&
          playersQuery.data.map((player) => (
            <div className="row" key={player.player_id}>
              <div className="col">
                <PlayerContainer>
                  <PlayerName name={player.name} onSave={(newName) => handleSaveName(player.player_id, newName)} />
                  {Object.entries(player.sections).map(([section, ratio]) => (
                    <Section key={section} $ratio={ratio.replace(":", "/")}>
                      {ratio}
                    </Section>
                  ))}
                  <div className="d-flex">
                    {inputsQuery.isLoading && <div className="spinner-border" role="status"></div>}
                    {inputsQuery.isError && (
                      <span className="badge text-light text-bg-danger">Input not available</span>
                    )}
                    {inputsQuery.data && (
                      <InputData
                        inputs={inputsQuery.data}
                        input={playersQuery.data.input}
                        onUpdateInput={(newInput) => updatePlayerInput(player.player_id, newInput)}
                      />
                    )}
                  </div>
                </PlayerContainer>
              </div>
            </div>
          ))}
      </div>
    </>
  );
};

export default PlayerConfiguration;
