import axios from "axios";

const URL = process.env.REACT_APP_SERVER_URL;

export function checkPixera(ip) {
  return axios.put(`${URL}/pixera/inputs`, { ip }).then((res) => res.data);
}

export function getInputs() {
  return axios.get(`${URL}/pixera/inputs`).then((res) => res.data);
}

export function getTimelines() {
  return axios.get(`${URL}/pixera/timeline/names`).then((res) => res.data);
}

export function getEffects() {
  return axios.get(`${URL}/pixera/inputs/effects`).then((res) => res.data);
}

export async function setTransportMode(handle, mode) {
  return axios.get(`${URL}/pixera/timeline/set-transport/${handle}/${mode}`).then((res) => res.data);
}

export function getTransportMode(handle) {
  return axios.get(`${URL}/pixera/timeline/get-transport/${handle}`).then((res) => res.data);
}

export function stopAllTimelines(handles) {
  handles.array.forEach((handle) => {
    setTransportMode(handle, 3);
  });
}

export function setTimelineName(handle, name) {
  return axios
    .post(`${URL}/pixera/timeline/set-name`, {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ handle, name }),
    })
    .then((res) => res.data);
}

export function createLayer(body) {
  return axios
    .post(`${URL}/pixera/layer/create`, {
      headers: {
        "Content-Type": "application/json",
      },
      body: body,
    })
    .then((res) => res.data);
}

export function getLayers(handle) {
  return axios.get(`${URL}/pixera/timeline/get-layers/${handle}`).then((res) => res.data);
}

export function getLayerData(handle) {
  return axios.get(`${URL}/pixera/layer/data/${handle}`).then((res) => res.data);
}

export function setInputName(handle, name) {
  return axios
    .post(`${URL}/pixera/inputs/set-name`, {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ handle: handle, name: name }),
    })
    .then((res) => res.data);
}

export function removeLayer(handle) {
  return axios.get(`${URL}/pixera/layer/remove/${handle}`).then((res) => res.data);
}

export function createTimeline() {
  return axios.get(`${URL}/pixera/timeline/create-timeline`).then((res) => res.data);
}

export function deleteTimeline(handle) {
  return axios.get(`${URL}/pixera/timeline/delete-timeline/${handle}`).then((res) => res.data);
}
