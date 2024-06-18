import React from "react";
import Matrix from "./Matrix";

const DefaultMatrix = {
  id: "4",
  name: "Vollflächig",
  date: "11.04.2024",
  default: false,
  active: false,
  ratios: [
    { ratio: "64:9", player: "Player 5", input: "Input 1", connection: "DP1", ratioID: "Ratio 1" },
    { ratio: "16:9", player: "Player 5", input: "Input 1", connection: "DP1", ratioID: "Ratio 1" },
    { ratio: "64:9", player: "Player 5", input: "Input 1", connection: "DP1", ratioID: "Ratio 1" },
  ],
};

const SelectedMatrix = () => {
  return <div></div>;
};

export default SelectedMatrix;

/**
       <Matrix id={DefaultMatrix.id} ratios={DefaultMatrix.ratios} />
      <Matrix />

 */
