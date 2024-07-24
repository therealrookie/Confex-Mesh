import axios from "axios";
import { getUrl } from "./database";

const URL = getUrl();

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
  console.log("HERE: ", handle, mode);
  return axios.get(`${URL}/pixera/timeline/set-transport/${handle}/${mode}`).then((res) => res.data);
}

export function getTransportMode(handle) {
  console.log("GET TRANSPORT");
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

export function createLayer(handle, body) {
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

/*

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const response = await axios.get(`http://localhost:5000/pixera/layer/data/${handle}`);
        console.log("DATA: ", response.data.size.W);
        setLayer(response.data);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [handle]);


useEffect(async () => {
    async function fetchData() {
      const request = await axios.get(`http://localhost:5000/pixera/timeline/get-layers/${handle}`);
      setLayerHandles(request.data);
      return request;
    }
    fetchData();
  }, [handle]);


  const addLayer = async (handle) => {
    try {
      const response = await fetch(`http://localhost:5000/pixera/layer/create`, {
        method: "POST", // Assuming POST is necessary here
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          timelineHandle: handle,
          width: 1652,
          height: 465,
          xPos: 2000,
          yPos: 0,
          resourceID: 4.994305985347123e15,
          left: 50,
          right: 0,
          top: 0,
          bottom: 0,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to create Layer");
      }
      console.log("Layer created: ", await response.json());
    } catch (error) {
      console.error("Failed to create Layer:", error);
    }
  };


  const setTimelineName = async (handle, name) => {
    try {
      const response = await fetch(`http://localhost:5000/pixera/timeline/set-name`, {
        method: "POST", // Assuming POST is necessary here
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ handle, name }), // Assuming backend expects a JSON body
      });
      if (!response.ok) {
        throw new Error("Failed to set timeline name");
      }
      console.log("Timeline name set:", await response.json());
    } catch (error) {
      console.error("Failed to set timeline name:", error);
    }
  };


  const fetchResources = async () => {
    try {
      const resourceResponse = await fetch("http://localhost:5000/pixera/inputs");
      const data = await resourceResponse.json();
      setInputs(data);
    } catch (error) {
      console.error("Failed to fetch inputs:", error);
    }
  };

  const fetchTimelines = async () => {
    try {
      const timelineResponse = await fetch("http://localhost:5000/pixera/timeline/names");
      const data = await timelineResponse.json();
      addDefaultValue(data);
    } catch (error) {
      console.error("Failed to fetch timelines:", error);
    }
  };

  const fetchEffects = async () => {
    try {
      const timelineResponse = await fetch("http://localhost:5000/pixera/inputs/effects");
      const data = await timelineResponse.json();
      //console.log("Effects: ", data);
    } catch (error) {
      console.error("Failed to fetch Effects:", error);
    }
  };

  const setTransportMode = async (handle, mode) => {
    try {
      const response = await fetch(`http://localhost:5000/pixera/timeline/set-transport/${handle}/${mode}`, {
        method: "GET",
      });
      if (!response.ok) {
        throw new Error("Failed to set transport mode");
      }
      console.log("Transport mode set:", await response.json());
    } catch (error) {
      console.error("Error setting transport mode:", error.message);
    }
    await fetchTimelines();
  };

*/
