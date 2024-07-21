// All Novastar API Requests

const express = require("express");
const axios = require("axios");
const router = express.Router();

const URL = `http://10.10.10.106:8001`;

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
    const response = await fetch(`${URL}/api/v1/device/cabinet`, {
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
    const response = await fetch(`${URL}/api/v1/device/cabinet/brightness`, requestOptions);
    const result = await response.text(); // Assuming the API returns text
    return result;
  } catch (error) {
    console.error("Error in adjustBrightness:", error);
    throw error; // Re-throw the error to be handled by the calling function
  }
}

module.exports = router;
