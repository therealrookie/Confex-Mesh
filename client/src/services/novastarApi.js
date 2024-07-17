// novastarApi.js
import axios from "axios";

export const getCabinets = (setCabinets, setBrightness) => {
  axios
    .get("http://localhost:5000/novastar/cabinets", {})
    .then((response) => {
      setCabinets(response.data.cabinetIds);
      setBrightness(response.data.brightness[0] * 100);
      console.log("RESPONSE", response);
    })
    .catch((error) => {
      console.error("Error updating brightness:", error);
    });
};

export const handleSliderChange = (event, cabinets, setBrightness) => {
  const newBrightness = event.target.value;
  setBrightness(newBrightness);

  // API request to change the brightness
  axios
    .put("http://localhost:5000/novastar/brightness", {
      cabinets: cabinets,
      brightness: newBrightness,
    })
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      console.error("Error updating brightness:", error);
    });
};
