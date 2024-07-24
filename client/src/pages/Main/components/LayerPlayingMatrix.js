import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { getLayerData, getLayers } from "../../../services/api";
import { getPlayers } from "../../../services/database";

const Shape = styled.div`
  position: absolute;
  left: ${(props) => props.$left}%;
  width: ${(props) => props.$width}%;
  height: 100%;
  background-color: ${(props) => (props.$index % 2 ? "#ccc" : "#ddd")};
  border: 1px solid #000;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const LayerPlayingMatrix = ({ zone }) => {
  // zone: {zone_id, matrix_id, player_id, layer_handle, pos_left, section}
  const [width, setWidth] = useState();
  const [player, setPlayer] = useState();
  const [ratio, setRatio] = useState();

  const { data: playersData } = useQuery({
    queryKey: ["players"],
    queryFn: async () => getPlayers(),
  });

  useEffect(() => {
    if (playersData) {
      const selectedPlayer = playersData.find((player) => player.player_id === zone.player_id);
      setPlayer(selectedPlayer);
    }
  }, [playersData, zone.player_id]);

  useEffect(() => {
    if (player && zone.section) {
      const section = Object.keys(player.sections).find((key) => key === zone.section);
      if (section) {
        setRatio(player.sections[section]);
      }
    }
  }, [player, zone.section]);

  useEffect(() => {
    if (ratio) {
      const calcWidth = () => {
        switch (ratio) {
          case "144:9":
            return 100;
          case "64:9":
            return 400 / 9;
          case "32:9":
            return 200 / 9;
          case "16:9":
            return 100 / 9;
          default:
            return 0;
        }
      };
      setWidth(calcWidth);
    }
  }, [player, ratio]);
  return (
    <Shape $left={zone.pos_left} $width={width} $index={zone.zone_id}>
      {ratio} {player ? player.name : "Loading..."}
    </Shape>
  );
};

export default LayerPlayingMatrix;
