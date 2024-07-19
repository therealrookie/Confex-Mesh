import axios from "axios";

export function updatePlayer(body) {
  return axios
    .put("http://localhost:5000/players", {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    .then((res) => res.data);
}

export function getPlayers() {
  return axios.get("http://localhost:5000/players").then((res) => res.data);
}

export async function getMatrices() {
  console.log("HERE");
  return axios.get("http://localhost:5000/data/matrices").then((res) => res.data);
}

export function getZones() {
  return axios.get("http://localhost:5000/data/zones").then((res) => res.data);
}

export function getZonesFromMatrixId(matrixId) {
  return axios.get(`http://localhost:5000/data/zones/${matrixId}`).then((res) => res.data);
}

export function addMatrix(handle, name) {
  return axios
    .post("http://localhost:5000/data/matrix", {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ handle, name }),
    })
    .then((res) => res.data);
}

export function addZone(body) {
  return axios
    .post("http://localhost:5000/data/zone", {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    .then((res) => res.data);
}

export function updateMatrixName(matrixId, name) {
  return axios
    .put(`http://localhost:5000/data/matrix-name`, {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ matrixId, name }),
    })
    .then((res) => res.data);
}

export function updateZone(body) {
  return axios
    .put(`http://localhost:5000/data/update-zone`, {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    .then((res) => res.data);
}

export function updateHandle(newTimelineHandle, matrixId) {
  return axios
    .put(`http://localhost:5000/data/update-handle`, {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ newTimelineHandle, matrixId }),
    })
    .then((res) => res.data);
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
