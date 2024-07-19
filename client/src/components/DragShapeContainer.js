import React from "react";
import { Container, PlayerContainer, ZoneContainer, ZoneShape, ZoneText } from "../services/StyledComponents";

const DragShapeContainer = ({ filteredPlayers, playerRatio, drag, setEdit }) => {
  return (
    <Container>
      {filteredPlayers.length > 0 ? (
        filteredPlayers.map((player) => (
          <PlayerContainer key={player.playerId}>
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
  );
};

export default DragShapeContainer;
