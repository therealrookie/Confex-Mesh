import React from "react";
import styled from "styled-components";
import Layer from "./Layer";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { getZonesFromMatrixId } from "../../../services/database";

const MatrixContainer = styled.div`
  position: relative;
  width: 100%;
  height: 50px;
  cursor: pointer;
  margin-bottom: 10px; // Add some spacing
  background-color: #f0f0f0;
`;

const Matrix = ({ matrixId }) => {
  const zonesQuery = useQuery({
    queryKey: ["zones", matrixId],
    enabled: true,
    queryFn: () => getZonesFromMatrixId(matrixId),
  });

  console.log("ZONES: ", zonesQuery.data);

  if (zonesQuery.isLoading) {
    return <p>loading ...</p>;
  }

  if (zonesQuery.isError) {
    return <pre>{JSON.stringify(zonesQuery.error)}</pre>;
  }

  if (!zonesQuery.data) {
    return <p>No layers available</p>;
  }

  return (
    <MatrixContainer>
      {zonesQuery.data.map((zone, index) => (
        <Layer zone={zone} />
      ))}
    </MatrixContainer>
  );
};

export default Matrix;

/*
        return <Layer key={zone.zone_id} handle={zone.layer_handle} index={index} zonesQuery={zonesQuery.data} />;


{layers.map((layer, index) => {
        let cropFactorLeft = "Cropping" in layer.description ? layer.description.Cropping.Left / 100 : 0;
        let cropFactorRight = "Cropping" in layer.description ? layer.description.Cropping.Right / 100 : 0;

        const properties = [
          layer.description.Size.W,
          layer.description.Size.H,
          layer.description.Position.X,
          layer.offset[0],
          cropFactorLeft,
          cropFactorRight,
        ];

        const [left, width, ratio] = calcProperties(properties);

        return (
          <ShapeContainer>
            <Shape key={index} $left={left} $width={width} $index={index}>
              {ratio}
            </Shape>
            {
              <Details key={index} $left={left} $width={width}>
                <div>{`Src: ${layer.description.Media.replace("Media/", "")}`}</div>
                <div>Player 1</div>
              </Details>
            }
          </ShapeContainer>
        );
      })}
      {console.log("Layers updated:", layers)}
 */

/*

*/
