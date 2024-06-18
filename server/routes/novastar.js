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

router.put;

module.exports = router;
