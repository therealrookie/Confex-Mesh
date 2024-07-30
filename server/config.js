const express = require("express");
const axios = require("axios");
const net = require("net");
const router = express.Router();
const pool = require("./db");

async function getURL() {
  const device = await getDevice();
  if (device === "main") {
    return getMainPixera();
  } else {
    return getBackupPixera();
  }
}

async function getDevice() {
  try {
    const data = await pool.query("SELECT * FROM helper WHERE name = $1", ["CurrentPixera"]);
    return data.rows[0].data; // Assuming the device type is stored in the 'data' column
  } catch (error) {
    console.error(error.message);
    throw new Error("Internal Server error");
  }
}

async function getMainPixera() {
  try {
    const ipResult = await pool.query("SELECT * FROM helper WHERE name = $1", ["IP Pixera four (main)"]);
    const portResult = await pool.query("SELECT * FROM helper WHERE name = $1", ["PORT Pixera four (main)"]);
    const ip = ipResult.rows[0].data; // Assuming the IP is stored in the 'data' column
    const port = portResult.rows[0].data; // Assuming the port is stored in the 'data' column
    return { ip, port };
  } catch (error) {
    console.error(error.message);
    throw new Error("Internal Server Error");
  }
}

async function getBackupPixera() {
  try {
    const ipResult = await pool.query("SELECT * FROM helper WHERE name = $1", ["IP Pixera four (backup)"]);
    const portResult = await pool.query("SELECT * FROM helper WHERE name = $1", ["PORT Pixera four (backup)"]);
    const ip = ipResult.rows[0].data; // Assuming the IP is stored in the 'data' column
    const port = portResult.rows[0].data; // Assuming the port is stored in the 'data' column
    return { ip, port };
  } catch (error) {
    console.error(error.message);
    throw new Error("Internal Server Error");
  }
}

async function sendTcpData(requestData) {
  const { ip, port } = await getURL(); // Get the IP and port dynamically
  return new Promise((resolve, reject) => {
    const client = new net.Socket();
    client.connect(port, ip, () => {
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

module.exports = { sendTcpData };
