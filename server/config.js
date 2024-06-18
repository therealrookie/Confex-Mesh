const express = require("express");
const axios = require("axios");
const net = require("net");
const router = express.Router();

const targetIP = "10.10.10.109";
const targetPort = 1400;

function sendTcpData(requestData) {
  return new Promise((resolve, reject) => {
    const client = new net.Socket();
    client.connect(targetPort, targetIP, () => {
      console.log("TCP connection established. Sending data...");
      client.write(requestData);
    });

    client.on("data", (data) => {
      console.log("Received data from TCP server:", data.toString());
      client.destroy(); // Close the connection
      resolve(data.toString().replace("0xPX", ""));
    });

    client.on("error", (err) => {
      console.error("TCP Client Error:", err);
      reject(err);
    });

    client.on("close", () => {
      console.log("TCP connection closed");
    });
  });
}

module.exports = { targetIP, targetPort, sendTcpData };
