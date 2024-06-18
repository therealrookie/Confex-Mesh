import React, { useState } from "react";
import styled from "styled-components";

const BrightnessCircle = styled.div`
  position: relative;
  width: 100px;
  height: 100px;
  background-color: transparent;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: ${({ percentage }) => `conic-gradient(
    #007bff 0% ${percentage}%,
    #e9ecef ${percentage}% 100%
  )`};
`;

const BrightnessPercentage = styled.span`
  position: absolute;
  font-size: 20px;
  color: #007bff;
  z-index: 1;
`;

let brightness = "75%";

const LedStatus = ({ initialBrightness = 75 }) => {
  const [brightness, setBrightness] = useState(initialBrightness);

  const handleSliderChange = (event) => {
    setBrightness(event.target.value);
  };

  return (
    <div>
      <BrightnessCircle percentage={brightness}>
        <BrightnessPercentage>{brightness}%</BrightnessPercentage>
      </BrightnessCircle>
      <input type="range" min="0" max="100" value={brightness} onChange={handleSliderChange} />
    </div>
  );
};

export default LedStatus;
