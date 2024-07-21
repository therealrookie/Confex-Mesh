// All Pixera API requests regarding Inputs / Resources

const express = require("express");
const router = express.Router();
const { sendTcpData } = require("../config");

router.put("/", async (req, res) => {
  try {
    const { handle, name } = req.body;
    const message =
      JSON.stringify({
        jsonrpc: "2.0",
        id: 337,
        method: "Pixera.Resources.Resource.setName",
        params: { handle: handle, name: name },
      }) + "0xPX";
    const answer = sendTcpData(message);
    res.send(answer);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});
/*
router.get("/", async (req, res) => {
  try {
    const resourceFolderHandle = await resourceFolder("Media");

    res.status(201).json(resourceFolderHandle);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});
*/

router.get("/", async (req, res) => {
  try {
    const resourceFolderHandle = await resourceFolder("Media/Live Inputs");

    const resourceHandleArray = await resourceHandles(resourceFolderHandle);
    const resources = await Promise.all(
      resourceHandleArray.map(async (resourceHandle) => {
        const handle = parseInt(resourceHandle);
        return {
          handle: handle,
          resid: await getResourceId(handle),
          name: await getResourceName(handle),
          fps: await getResourceFps(handle),
          resolution: await getResourceResolution(handle),
          running: await getActiveState(handle),
          mode: await getVideoModes(handle),
        };
      })
    );
    //let inputs = resources.filter((item) => item.mode == "LiveInput");
    res.status(201).json(resources);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

async function resourceFolder(path) {
  const message =
    JSON.stringify({
      jsonrpc: "2.0",
      id: 290,
      method: "Pixera.Resources.getResourceFolderWithNamePath",
      params: { namePath: path },
    }) + "0xPX";
  const data = JSON.parse(await sendTcpData(message));
  if (data.error) throw new Error(data.error.message);
  return data.result;
}

async function resourceHandles(handle) {
  const message =
    JSON.stringify({
      jsonrpc: "2.0",
      id: 298,
      method: "Pixera.Resources.ResourceFolder.getResources",
      params: { handle: handle },
    }) + "0xPX";
  const data = JSON.parse(await sendTcpData(message));
  if (data.error) throw new Error(data.error.message);
  return data.result;
}

router.get("/effects", async (req, res) => {
  try {
    const effectFolderHandle = parseInt(await resourceFolder("Effects"));
    const effectHandleArray = await resourceHandles(effectFolderHandle);
    const effects = await Promise.all(
      effectHandleArray.map(async (effectHandle) => {
        const handle = parseInt(effectHandle);
        return {
          handle: handle,
          resid: await getResourceId(handle),
          name: await getResourceName(handle),
        };
      })
    );
    res.send(effects);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

async function getResourceId(handle) {
  const message =
    JSON.stringify({
      jsonrpc: "2.0",
      id: 343,
      method: "Pixera.Resources.Resource.getId",
      params: { handle: handle },
    }) + "0xPX";
  const data = JSON.parse(await sendTcpData(message));
  if (data.error) throw new Error(data.error.message);
  return data.result;
}

async function getVideoModes(handle) {
  const message =
    JSON.stringify({
      jsonrpc: "2.0",
      id: 345,
      method: "Pixera.Resources.Resource.getType",
      params: { handle: handle },
    }) + "0xPX";
  const data = JSON.parse(await sendTcpData(message));
  if (data.error) throw new Error(data.error.message);
  return data.result;
}

async function getActiveState(handle) {
  const message =
    JSON.stringify({
      jsonrpc: "2.0",
      id: 340,
      method: "Pixera.Resources.Resource.getIsActive",
      params: { handle: handle },
    }) + "0xPX";
  const data = JSON.parse(await sendTcpData(message));
  if (data.error) throw new Error(data.error.message);
  return data.result;
}

async function getResourceFps(handle) {
  const message =
    JSON.stringify({
      jsonrpc: "2.0",
      id: 338,
      method: "Pixera.Resources.Resource.getFps",
      params: { handle: handle },
    }) + "0xPX";
  const data = JSON.parse(await sendTcpData(message));
  if (data.error) throw new Error(data.error.message);
  return data.result;
}

async function getResourceResolution(handle) {
  const message =
    JSON.stringify({
      jsonrpc: "2.0",
      id: 339,
      method: "Pixera.Resources.Resource.getResolution",
      params: { handle: handle },
    }) + "0xPX";
  const data = JSON.parse(await sendTcpData(message));
  if (data.error) throw new Error(data.error.message);
  return `${data.result[0]}x${data.result[1]}`;
}

async function getResourceName(handle) {
  const message =
    JSON.stringify({
      jsonrpc: "2.0",
      id: 336,
      method: "Pixera.Resources.Resource.getName",
      params: { handle: handle },
    }) + "0xPX";
  const data = JSON.parse(await sendTcpData(message));
  if (data.error) throw new Error(data.error.message);
  return data.result;
}

router.post("/set-name", async (req, res) => {
  console.log("REQ.BODY: ", req.body);

  try {
    const { handle, name } = JSON.parse(req.body.body);
    console.log("NEW INPUT NAME: ", handle, name);
    const message =
      JSON.stringify({
        jsonrpc: "2.0",
        id: 337,
        method: "Pixera.Resources.Resource.setName",
        params: { handle: parseInt(handle), name: name },
      }) + "0xPX";
    const answer = sendTcpData(message);
    res.send(answer);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
