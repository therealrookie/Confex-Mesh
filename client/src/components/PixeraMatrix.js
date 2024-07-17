import React, { useState } from "react";
import styled from "styled-components";

const MatrixContainer = styled.div`
  position: relative;
  width: 100%;
  height: 50px;
  cursor: pointer;
  margin-bottom: 10px; // Add some spacing
  background-color: #fafafa;
`;

const ShapeContainer = styled.div`
  width: 100%;
`;

const Shape = styled.div`
  position: absolute;
  left: ${(props) => props.$left}%;
  width: ${(props) => props.$width}%;
  height: 100%;
  background-color: ${(props) => (props.$index % 2 ? "#ccc" : "#ddd")};
  color: 1px solid #000;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ShapeInner = styled.div`
  position: absolute;
  height: 100%;
  background-color: #ccc; // Example background color for visibility
`;

const Details = styled.div`
  position: absolute;
  left: ${(props) => props.$left}%;
  width: ${(props) => props.$width}%;
  top: 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #f0f0f0;
  padding: 10px;
  margin-top: 5px; // Space between the shapes and details
`;

const ActivateMatrix = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
`;

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

const PixeraMatrix = ({ layers }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  function scale(number, inMin, inMax, outMin, outMax) {
    return ((number - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
    //return (number / 7440) * 100;
  }

  function calcProperties(properties) {
    const [width, height, pos, offset, cropLeft, cropRight] = properties;

    let newWidth = cropLeft > 0 || cropRight > 0 ? width * Math.abs(cropLeft - cropRight) : width;
    const ratio = `${Math.round((newWidth / height) * 9)}:9`;
    let left = offset * 500 + pos - width / 2;
    if (cropLeft > 0) {
      left += cropLeft * width;
    }

    return [scale(left, -3720, 3720, 0, 100), scale(newWidth, 0, 7440, 0, 100), ratio];
  }

  return (
    <MatrixContainer onClick={toggleExpand}>
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
            {isExpanded && (
              <Details key={index} $left={left} $width={width}>
                <div>{`Src: ${layer.description.Media.replace("Media/", "")}`}</div>
                <div>Player 1</div>
              </Details>
            )}
          </ShapeContainer>
        );
      })}
    </MatrixContainer>
  );
};

export default PixeraMatrix;
