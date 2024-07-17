// All Pixera API requests regarding Timelines

const express = require("express");
const router = express.Router();
const { sendTcpData } = require("../config");

router.get("/set-transport/:handle/:mode", (req, res) => {
  try {
    const timelineHandle = parseInt(req.params.handle);
    const transportMode = parseInt(req.params.mode);
    const message =
      JSON.stringify({
        jsonrpc: "2.0",
        id: 462,
        method: "Pixera.Timelines.Timeline.setTransportMode",
        params: { handle: timelineHandle, mode: transportMode },
      }) + "0xPX";
    sendTcpData(message);
  } catch (error) {
    res.status(500).send({ error: err.message });
  }
});

router.get("/names", async (req, res) => {
  try {
    const timelineHandles = await getTimelineHandles();

    const timelines = await Promise.all(
      timelineHandles.map(async (timelineHandle) => {
        const handle = parseInt(timelineHandle);
        return {
          handle: handle,
          name: await getTimelineName(handle),
          transportMode: await getTransportMode(handle),
        };
      })
    );
    res.send(timelines);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

async function getTimelineHandles() {
  const message = JSON.stringify({ jsonrpc: "2.0", id: 417, method: "Pixera.Timelines.getTimelines" }) + "0xPX";
  const data = JSON.parse(await sendTcpData(message));
  if (data.error) throw new Error(data.error.message);
  return data.result;
}

async function getTimelineName(handle) {
  const message =
    JSON.stringify({
      jsonrpc: "2.0",
      id: 466,
      method: "Pixera.Timelines.Timeline.getName",
      params: { handle: handle },
    }) + "0xPX";
  const data = JSON.parse(await sendTcpData(message));
  if (data.error) throw new Error(data.error.message);
  return data.result;
}

async function getTransportMode(handle) {
  const message =
    JSON.stringify({
      jsonrpc: "2.0",
      id: 463,
      method: "Pixera.Timelines.Timeline.getTransportMode",
      params: { handle: handle },
    }) + "0xPX";
  const data = JSON.parse(await sendTcpData(message));
  if (data.error) throw new Error(data.error.message);
  return data.result;
}

router.post("/set-name", async (req, res) => {
  try {
    const { handle, name } = JSON.parse(req.body.body);
    const message =
      JSON.stringify({
        jsonrpc: "2.0",
        id: 467,
        method: "Pixera.Timelines.Timeline.setName",
        params: { handle: handle, name: name },
      }) + "0xPX";
    const answer = sendTcpData(message);
    res.send(answer);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.get("/get-layers/:handle", async (req, res) => {
  try {
    const timelineHandle = parseInt(req.params.handle);
    const layerHandles = await getLayerHandles(timelineHandle);

    const layers = await Promise.all(
      layerHandles.map(async (layerHandle) => {
        const handle = parseInt(layerHandle);
        return {
          handle: handle,
          name: await getLayerName(handle),
        };
      })
    );

    res.send(layers);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

async function getLayerHandles(handle) {
  const message =
    JSON.stringify({
      jsonrpc: "2.0",
      id: 432,
      method: "Pixera.Timelines.Timeline.getLayers",
      params: { handle: handle },
    }) + "0xPX";
  const data = JSON.parse(await sendTcpData(message));
  if (data.error) throw new Error(data.error.message);
  return data.result;
}

async function getLayerName(handle) {
  const message =
    JSON.stringify({
      jsonrpc: "2.0",
      id: 504,
      method: "Pixera.Timelines.Layer.getName",
      params: { handle: handle },
    }) + "0xPX";
  const data = JSON.parse(await sendTcpData(message));
  if (data.error) throw new Error(data.error.message);
  return data.result;
}

router.get("/create-timeline", async (req, res) => {
  try {
    const message = JSON.stringify({ jsonrpc: "2.0", id: 420, method: "Pixera.Timelines.createTimeline" }) + "0xPX";
    const data = JSON.parse(await sendTcpData(message));
    res.status(201).json(data.result);
  } catch (error) {
    res.status(500).send({ error: err.message });
  }
});

module.exports = router;
