import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { EditIcon, SdiIcon, HdmiIcon } from "../assets/icons";
import InputData from "./InputData";
import PlayerName from "./PlayerName";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getInputs, setInputName } from "../services/api";
import { getPlayers, updatePlayer } from "../services/database";
import axios from "axios";

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

const Zone = styled.div`
  margin: 5px;
  padding: 0;
  height: 50px;
  aspect-ratio: ${(props) => props.ratio};
  background-color: #fff;
  border-radius: 2px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const PlayerConfiguration = () => {
  const [prevPlayerNames, setPrevPlayerNames] = useState({});
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
      queryClient.setQueryData(["players", data.id], data);
      queryClient.invalidateQueries(["players", { exact: true }]);
    },
  });

  useEffect(() => {
    if (playersQuery.data) {
      const initialNames = playersQuery.data.reduce((acc, player) => {
        acc[player.id] = player.name;
        return acc;
      }, {});
      setPrevPlayerNames(initialNames);
    }
  }, [playersQuery.data]);

  const handleSubmit = (id, name, input, handle, resid) => {
    playersMutation.mutate({
      id: id,
      name: name,
      input: Array.isArray(input) ? input : [input],
      handle: Array.isArray(handle) ? handle : [handle],
      resid: Array.isArray(resid) ? resid : [resid],
    });
  };

  const handleSaveName = async (id, newName) => {
    const player = playersQuery.data.find((player) => player.id === id);
    const prevName = prevPlayerNames[id];

    const updatedInputs = await Promise.all(
      player.input.map(async (input, index) => {
        const newInputName = input.includes(prevName) ? input.replace(prevName, newName) : input;

        const answer = await setInputName(player.handle[index], newInputName);
        console.log("ANSWER 1: ", newInputName);
        return newInputName;
      })
    );

    handleSubmit(id, newName, updatedInputs, player.handle, player.resid);

    setPrevPlayerNames((prevNames) => ({
      ...prevNames,
      [id]: newName,
    }));
  };

  const updatePlayerInput = async (id, newInput, inputIndex) => {
    const player = playersQuery.data.find((player) => player.id === id);

    const newInputs = [...player.input];
    newInputs[inputIndex] = newInput.name;

    const newHandles = [...player.handle];
    newHandles[inputIndex] = newInput.handle;

    const newResids = [...player.resid];
    newResids[inputIndex] = newInput.resid;

    const answer = await setInputName(newHandles[inputIndex], newInputs[inputIndex]);
    console.log("ANSWER 2: ", newInputs[inputIndex]);

    handleSubmit(id, player.name, newInputs, newHandles, newResids);
  };

  if (inputsQuery.isLoading || playersQuery.isLoading) {
    return <p>loading ...</p>;
  }

  if (inputsQuery.isError || playersQuery.isError) {
    return <pre>{JSON.stringify(inputsQuery.error || playersQuery.error)}</pre>;
  }

  return (
    <>
      <h1>Player Configuration</h1>
      <div className="container text-center">
        {playersQuery.data.map((player, index) => (
          <div className="row" key={player.id}>
            <div className="col">
              <PlayerContainer>
                <PlayerName name={player.name} onSave={(newName) => handleSaveName(player.id, newName)} />
                {Object.entries(player.zones).map(([zoneId, ratio]) => (
                  <Zone key={zoneId} ratio={ratio.replace(":", "/")}>
                    {ratio}
                  </Zone>
                ))}
                <div className="d-flex">
                  {player.input.map((currInput, index) => (
                    <InputData
                      key={index}
                      inputs={inputsQuery.data}
                      input={currInput}
                      onUpdateInput={(newInput) => updatePlayerInput(player.id, newInput, index)}
                    />
                  ))}
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

/*
const handleSaveName = (id, newName) => {
    const player = playersQuery.data.find((player) => player.id === id);
    handleSubmit(id, newName, player.input, player.handle, player.resid);
  };






    <>
      <h1>Player Configuration</h1>
      <div className="container text-center">
        {players.map((player, index) => (
          <div className="row" key={player.id}>
            <div className="col">
              <PlayerContainer>
                <PlayerName name={player.name} onSave={(newName) => handleSaveName(player.id, newName)} />
                {Object.entries(player.zones).map(([zoneId, ratio]) => (
                  <Zone key={zoneId} ratio={ratio.replace(":", "/")}>
                    {ratio}
                  </Zone>
                ))}
                <div className="d-flex">
                  {player.input.map((input, index) => (
                    <InputData
                      key={index}
                      inputs={inputs}
                      input={input}
                      onUpdateInput={(newInput) => updatePlayerInput(player.id, newInput, index)}
                    />
                  ))}
                </div>
              </PlayerContainer>
            </div>
          </div>
        ))}
      </div>
    </>


*/
