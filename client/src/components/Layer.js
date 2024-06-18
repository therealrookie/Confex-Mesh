import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { getLayerData, getLayers } from "../services/api";
import { getPlayers } from "../services/database";
import { calcDimensions, calcPositions, checkCropping } from "../services/calculations";
import { useEditLayer } from "../context/EditLayerContext";

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

const Layer = ({ handle, index, layersQuery }) => {
  const [props, setProps] = useState({ left: 0, width: 0, ratio: "" });
  const [player, setPlayer] = useState();

  const { editLayer, setEditLayer } = useEditLayer();

  const layerExists = layersQuery.data?.some((layer) => layer.handle === handle);

  /*
  const layersQuery = useQuery({
    queryKey: ["layers", timelineHandle],
    enabled: true,
    queryFn: () => getLayers(handle),
  });
*/
  const layerQuery = useQuery({
    queryKey: ["layer", handle],
    enabled: layerExists, //layersQuery.data.find((layer) => layer.handle === handle),
    queryFn: () => getLayerData(handle),
  });

  const playersQuery = useQuery({
    queryKey: ["players"],
    queryFn: () => getPlayers(),
  });

  function calcProperties() {
    if (layerQuery.data) {
      const [width, height, ratio] = calcDimensions(layerQuery.data);
      const [left, top] = calcPositions(layerQuery.data);

      setProps({ left: left, top: top, width: width, height: height, ratio: ratio });
    }
  }

  function assignPlayer() {
    if (!playersQuery.data || !layerQuery.data) return;

    const layerInput = layerQuery.data.input;

    const matchingPlayers = playersQuery.data.filter((player) => layerInput.includes(player.name));

    if (matchingPlayers.length > 0) {
      setPlayer(`${matchingPlayers[0].name} - ${checkCropping(layerQuery.data.cropping)}`);
    } else {
      setPlayer("null");
    }
  }

  useEffect(() => {
    if (layerQuery.data) {
      calcProperties();
    }
  }, [layerQuery.data]); // This useEffect runs whenever 'layerQuery.data' changes.

  useEffect(() => {
    assignPlayer();
  }, [props, playersQuery.data]);

  if (layerQuery.isLoading || playersQuery.isLoading) {
    return <p>Loading...</p>;
  }

  if (layerQuery.isError || playersQuery.isError) {
    return <pre>{JSON.stringify(layerQuery.error || playersQuery.error)}</pre>;
  }

  return (
    <div>
      <Shape
        $left={props.left}
        $width={props.width}
        $index={index}
        onClick={() => {
          setEditLayer(editLayer.handle === handle ? { handle: null, props: null } : { handle: handle, props: props });
        }}
      >
        {props.ratio} {player}
      </Shape>
    </div>
  );
};

export default Layer;

/*

const InputContainer = styled.div`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  align-content: space-around;
  border: 0.5px solid grey;
  border-radius: 50%;
  padding: 3px;
`;

 */
