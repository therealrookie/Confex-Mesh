import axios from "axios";

export function updatePlayer(body) {
  console.log("BODY:: ", body);
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

export function getTimelines() {
  return axios.get("http://localhost:5000/timelines").then((res) => res.data);
}

export function getLayers() {
  return axios.get("http://localhost:5000/layers").then((res) => res.data);
}

export function getLayersFromTimeline(timelineHandle) {
  return axios.get(`http://localhost:5000/layers/${timelineHandle}`).then((res) => res.data);
}

export function addTimeline(handle, name) {
  return axios
    .post("http://localhost:5000/timeline", {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ handle, name }),
    })
    .then((res) => res.data);
}

export function addLayer(body) {
  return axios
    .post("http://localhost:5000/layer", {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    .then((res) => res.data);
}

export function updateTimeline(handle, name) {
  return axios
    .put(`http://localhost:5000/timeline`, {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ handle, name }),
    })
    .then((res) => res.data);
}

export function updateLayer(body) {
  return axios
    .put(`http://localhost:5000/layer`, {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    .then((res) => res.data);
}

export function updateHandle(newHandle, oldHandle) {
  return axios
    .put(`http://localhost:5000/update-handle`, {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ newHandle, oldHandle }),
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
