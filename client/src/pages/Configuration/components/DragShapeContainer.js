import React from "react";
import { Container, PlayerContainer, Players, ZoneContainer, ZoneShape, ZoneText } from "./StyledComponents";

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
const DragShapeContainer = ({ filteredPlayers, playerRatio, drag, setEdit }) => {
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
                    ratio === playerRatio && (
                      <ZoneShape
                        key={section}
                        playerId={player.playerId}
                        $ratioWidth={parseInt(ratio.split(":")[0], 10)}
                        $ratioHeight={parseInt(ratio.split(":")[1], 10)}
                        draggable
                        onDragStart={(event) => drag(event, player, section, ratio)}
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

export default DragShapeContainer;
