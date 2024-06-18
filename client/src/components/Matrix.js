import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Layer from "./Layer";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { getLayers } from "../services/api";

const MatrixContainer = styled.div`
  position: relative;
  width: 100%;
  height: 50px;
  cursor: pointer;
  margin-bottom: 10px; // Add some spacing
  background-color: #f0f0f0;
`;

const Matrix = ({ handle }) => {
  const layersQuery = useQuery({
    queryKey: ["layers", handle],
    enabled: true,
    queryFn: () => getLayers(handle),
  });

  if (layersQuery.isLoading) {
    return <p>loading ...</p>;
  }

  if (layersQuery.isError) {
    return <pre>{JSON.stringify(layersQuery.error)}</pre>;
  }

  if (!layersQuery.data) {
    return <p>No layers available</p>;
  }

  return (
    <MatrixContainer>
      {layersQuery.data.map((layer, index) => {
        return <Layer handle={layer.handle} index={index} layersQuery={layersQuery.data} />;
      })}
    </MatrixContainer>
  );
};

export default Matrix;

/*


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
