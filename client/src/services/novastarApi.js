// novastarApi.js
import axios from "axios";

const URL = "http://10.10.10.102";
const PORT = 5000;

export const getCabinets = (setCabinets, setBrightness) => {
  axios
    .get(`${URL}:${PORT}/novastar/cabinets`, {})
    .then((response) => {
      setCabinets(response.data.cabinetIds);
      setBrightness(response.data.brightness[0] * 100);
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
    .put(`${URL}:${PORT}/novastar/brightness`, {
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
