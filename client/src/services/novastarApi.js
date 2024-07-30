// novastarApi.js
import axios from "axios";

const URL = process.env.REACT_APP_SERVER_URL;

export const getCabinets = (setCabinets, setBrightness) => {
  axios
    .get(`${URL}/novastar/cabinets`, {})
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
    .put(`${URL}/novastar/brightness`, {
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

export function checkNovastarConnection(ip) {
  return axios.put(`${URL}/novastar/check-connection`, { ip }).then((res) => res.data);
}
