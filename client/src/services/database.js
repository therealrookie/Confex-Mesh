import axios from "axios";
import { getEffects } from "./api";

export function getUrl() {
  const PORT = 5000;
  const URL = "http://10.10.10.102";

  return `${URL}:${PORT}`;
}

const URL = getUrl();

export function updatePlayer(body) {
  return axios
    .put(`${URL}/players`, {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    .then((res) => res.data);
}

export function getPlayers() {
  return axios.get(`${URL}/players`).then((res) => res.data);
}

export async function getMatrices() {
  console.log("GET MATRICES");
  return axios.get(`${URL}/data/matrices`).then((res) => res.data);
}

export function getZones() {
  return axios.get(`${URL}/data/zones`).then((res) => res.data);
}

export function getZone(zoneId) {
  return axios.get(`${URL}/data/zone/${zoneId}`).then((res) => res.data);
}

export function getZonesFromMatrixId(matrixId) {
  return axios.get(`${URL}/data/zones/${matrixId}`).then((res) => res.data);
}

export async function updateEffects() {
  const effects = await getEffects();
  const cropping = effects.find((effect) => effect.name === "CroppingHardEdge");
  const body = { effectName: cropping.name, effectHandle: cropping.handle };
  return axios
    .put(`${URL}/data/update-effect`, {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    .then((res) => res.data);
}

export function addMatrix(timelineHandle, name) {
  return axios
    .post(`${URL}/data/matrix`, {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ timelineHandle, name }),
    })
    .then((res) => res.data);
}

export function addZone(body) {
  return axios
    .post(`${URL}/data/zone`, {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    .then((res) => res.data);
}

export function updateMatrixName(matrixId, name) {
  return axios
    .put(`${URL}/data/matrix-name`, {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ matrixId, name }),
    })
    .then((res) => res.data);
}

export function updateZone(body) {
  return axios
    .put(`${URL}/data/update-zone`, {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    .then((res) => res.data);
}

export function updateHandle(newTimelineHandle, matrixId) {
  console.log("UPDATE HANDLE");

  return axios
    .put(`${URL}/data/update-handle`, {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ newTimelineHandle, matrixId }),
    })
    .then((res) => res.data);
}

export function deleteMatrix(matrixId) {
  return axios.delete(`${URL}/data/delete-matrix/${matrixId}`).then((res) => res.data);
}

/*
  const updatePlayer = async (id) => {
    const player = players.find((player) => player.id === id);
    console.log("BODY: ", player);

    try {
      const body = {
        id: id,
        name: player.name,
        input: player.input,
        handle: player.handle,
        resid: player.resid,
      };
      const response = await fetch(`http://localhost:5000/players/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      //window.location = "/configuration";
    } catch (err) {
      console.error(err.message);
    }
  };

      const fetchPlayers = async () => {
    try {
      const response = await fetch("http://localhost:5000/players");
      const jsonData = await response.json();

      setPlayers(jsonData);
    } catch (err) {
      console.error(err.message);
    }
  };

*/
