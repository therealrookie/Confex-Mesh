// All Novastar API Requests

const express = require("express");
const axios = require("axios");
const router = express.Router();

let cabinetIds = [];

// Endpoint to get input sources from Novastar Controller
router.get("/inputs", async (req, res) => {
  try {
    const response = await axios.get("http://10.10.10.106:8001/api/v1/device/input/sources");
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching from Novastar Controller:", error.message);
    res.status(500).send("Unable to connect to Novastar Controller");
  }
});
/*
router.get("/cabinets", async (req, res) => {
  try {
    const response = await axios.get("http://10.10.10.106:8001/api/v1/device/cabinet");
    // Assuming the cabinet IDs are stored in a property named 'id' within each cabinet object
    console.log(response.data);
    const cabinetIds = response.data.data.map((cabinet) => cabinet.id); // Adjust the path according to actual response structure
    res.json(cabinetIds); // Send the array of IDs back to the client
  } catch (error) {
    console.error("Error fetching from Novastar Controller:", error.message);
    res.status(500).send("Unable to connect to Novastar Controller");
  }
});
*/
router.get("/inputdata/:url", async (req, res) => {
  const url = req.params.url;
  axios({
    method: "get",
    url: `http://${url}:8001/api/v1/device/input/sources`,
    headers: {
      "User-Agent": "Apifox/1.0.0 (https://apifox.com)",
    },
  })
    .then(function (response) {
      const inputNames = response.data.data.map((input) => input.name);
      console.log(JSON.stringify(`Response Code: ${response.data.code} Inputs: ${inputNames}`));
      res.json(inputNames);
    })
    .catch(function (error) {
      console.log(error.code);
    });
});

router.get("/monitoring/:url", async (req, res) => {
  const url = req.params.ip;
  axios({
    method: "get",
    url: "http://${url}:8001/api/v1/device/monitor/info",
    headers: {
      "User-Agent": "Apifox/1.0.0 (https://apifox.com)",
    },
  })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error.code);
    });
});
/*
router.put("/brightness", async (req, res) => {
  const { screenIdList, brightness } = req.body;

  console.log("BRIGHTNESS: ", brightness);

  if (!screenIdList || !brightness) {
    return res.status(400).send("screenIdList and brightness are required");
  }

  try {
    const response = await axios.put(
      "http://10.10.10.106:8001/api/v1/screen/brightness",
      {
        screenIdList,
        brightness,
      },
      {
        headers: {
          "User-Agent": "Apifox/1.0.0 (https://apifox.com)",
          "Content-Type": "application/json",
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Error updating brightness:", error.message);
    res.status(500).send("Unable to update brightness");
  }
});


router.put("/brightness", async (req, res) => {
  const { screenIdList, brightness } = req.body;

  console.log("BRIGHTNESS: ", brightness);

  fetch("http://10.10.10.106:8001/api/v1/screen/brightness", {
    method: "PUT",
    headers: {
      "User-Agent": "Apifox/1.0.0 (https://apifox.com)",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      screenIdList,
      brightness,
    }),
    redirect: "follow",
  })
    .then((result) => console.log(result))
    .catch((error) => console.log("error", error));
});
*/

router.get("/cabinets", async (req, res) => {
  try {
    const result = await getCabinets();
    res.json(result);
  } catch (err) {
    console.error("Error fetching cabinets:", err);
    res.status(500).send("Error fetching cabinets");
  }
});

router.put("/brightness", async (req, res) => {
  const { cabinets, brightness } = req.body;

  try {
    const result = await adjustBrightness(cabinets, brightness / 100);
    res.json(result); // Return the result to the client
  } catch (error) {
    console.error("Error fetching cabinets:", error);
    res.status(500).send("Error fetching cabinets");
  }
});

async function getCabinets() {
  try {
    const response = await fetch("http://10.10.10.106:8001/api/v1/device/cabinet", {
      method: "GET",
      headers: { "User-Agent": "Apifox/1.0.0 (https://apifox.com)" },
      redirect: "follow",
    });
    const result = await response.json(); // Assuming the API returns JSON
    const cabinetIds = result.data.map((cabinet) => cabinet.id);
    const brightness = getCurrentBrightness(result.data);
    return { cabinetIds, brightness };
  } catch (error) {
    console.error("Error in getCabinets:", error);
    throw error; // Re-throw the error to be handled by the calling function
  }
}

function getCurrentBrightness(cabinets) {
  const brightnessValues = cabinets.map((cabinet) => cabinet.brightness);
  const uniqueBrightnessValues = new Set(brightnessValues);
  return [...uniqueBrightnessValues];
}

async function adjustBrightness(cabinetIds, brightness) {
  const myHeaders = new Headers();
  myHeaders.append("User-Agent", "Apifox/1.0.0 (https://apifox.com)");
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    idList: cabinetIds,
    ratio: brightness,
  });

  const requestOptions = {
    method: "PUT",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  try {
    const response = await fetch("http://10.10.10.106:8001/api/v1/device/cabinet/brightness", requestOptions);
    const result = await response.text(); // Assuming the API returns text
    return result;
  } catch (error) {
    console.error("Error in adjustBrightness:", error);
    throw error; // Re-throw the error to be handled by the calling function
  }
}

module.exports = router;
