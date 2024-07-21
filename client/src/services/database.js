import axios from "axios";

const URL = "http://10.10.10.102";
const PORT = 5000;

export function updatePlayer(body) {
  return axios
    .put(`${URL}:${PORT}/players`, {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    .then((res) => res.data);
}

export function getPlayers() {
  return axios.get(`${URL}:${PORT}/players`).then((res) => res.data);
}

export async function getMatrices() {
  return axios.get(`${URL}:${PORT}/data/matrices`).then((res) => res.data);
}

export function getZones() {
  return axios.get(`${URL}:${PORT}/data/zones`).then((res) => res.data);
}

export function getZone(zoneId) {
  return axios.get(`${URL}:${PORT}/data/zone/${zoneId}`).then((res) => res.data);
}

export function getZonesFromMatrixId(matrixId) {
  return axios.get(`${URL}:${PORT}/data/zones/${matrixId}`).then((res) => res.data);
}

export function addMatrix(handle, name) {
  return axios
    .post(`${URL}:${PORT}/data/matrix`, {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ handle, name }),
    })
    .then((res) => res.data);
}

export function addZone(body) {
  return axios
    .post(`${URL}:${PORT}/data/zone`, {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    .then((res) => res.data);
}

export function updateMatrixName(matrixId, name) {
  return axios
    .put(`${URL}:${PORT}/data/matrix-name`, {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ matrixId, name }),
    })
    .then((res) => res.data);
}

export function updateZone(body) {
  return axios
    .put(`${URL}:${PORT}/data/update-zone`, {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    .then((res) => res.data);
}

export function updateHandle(newTimelineHandle, matrixId) {
  return axios
    .put(`${URL}:${PORT}/data/update-handle`, {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ newTimelineHandle, matrixId }),
    })
    .then((res) => res.data);
}

export function deleteMatrix(matrixId) {
  return axios.delete(`${URL}:${PORT}/data/delete-matrix/${matrixId}`).then((res) => res.data);
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
