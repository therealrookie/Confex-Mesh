import React, { useState, useEffect } from "react";
import { getCabinets, handleSliderChange } from "../../../services/novastarApi";
const LedStatus = () => {
  const [brightness, setBrightness] = useState(50); // Setting an initial value for the slider
  const [cabinets, setCabinets] = useState();

  useEffect(() => {
    getCabinets(setCabinets, setBrightness);
  }, []);

  return (
    <div className="p-2 m-2 border rounded">
      <h4>Brightness Control</h4>
      <input
        type="range"
        className="form-range px-5"
        min="0"
        max="100"
        value={brightness}
        step="2"
        onChange={(event) => handleSliderChange(event, cabinets, setBrightness)}
      ></input>
    </div>
  );
};

export default LedStatus;
