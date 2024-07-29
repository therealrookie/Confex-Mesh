// All Pixera API requests regarding Layers

const express = require("express");
const router = express.Router();
const { sendTcpData } = require("../config");
const axios = require("axios");
const pool = require("../db");

router.get("/description/:handle", async (req, res) => {
  try {
    const handle = parseInt(req.params.handle);
    const message =
      JSON.stringify({
        jsonrpc: "2.0",
        id: 506,
        method: "Pixera.Timelines.Layer.getLayerJsonDescrip",
        params: { handle: handle },
      }) + "0xPX";
    const data = JSON.parse(await sendTcpData(message));
    res.send(data.result);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.get("/data/:handle", async (req, res) => {
  try {
    const handle = parseInt(req.params.handle);
    const description = await getLayerDescription(handle);
    const offset = await getLayerOffset(handle);
    console.log("DESCRIPTION: ", offset);

    const layerData = {
      handle: handle,
      input: description.Media,
      position: description.Position,
      size: description.Size,
      cropping: description.Cropping || {
        "Angle[deg]": 0.0,
        Bottom: 0.0,
        "Bottom Softness[%]": 0.0,
        Left: 0.0,
        "Left Softness[%]": 0.0,
        "Mix[%]": 0.0,
        Right: 0.0,
        "Right Softness[%]": 0.0,
        Top: 0.0,
        "Top Softness[%]": 0.0,
      },
      offset: offset,
    };
    res.send(layerData);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

async function getLayerDescription(handle) {
  const message =
    JSON.stringify({
      jsonrpc: "2.0",
      id: 506,
      method: "Pixera.Timelines.Layer.getLayerJsonDescrip",
      params: { handle: handle },
    }) + "0xPX";
  const data = JSON.parse(await sendTcpData(message));
  if (data.error) throw new Error(data.error.message);
  return JSON.parse(data.result);
}

async function getLayerOffset(handle) {
  const message =
    JSON.stringify({
      jsonrpc: "2.0",
      id: 556,
      method: "Pixera.Timelines.Layer.getOffsets",
      params: { handle: handle },
    }) + "0xPX";
  const data = JSON.parse(await sendTcpData(message));
  if (data.error) throw new Error(data.error.message);
  return data.result;
}

router.put("/description/:handle", async (req, res) => {
  try {
    const handle = parseInt(req.params.handle);
    const { description } = req.body;
    const message =
      JSON.stringify({
        jsonrpc: "2.0",
        id: 507,
        method: "Pixera.Timelines.Layer.setLayerJsonDescrip",
        params: { handle: handle, descrip: description, makeAllDominant: true },
      }) + "0xPX";
    const data = JSON.parse(await sendTcpData(message));
    res.send(data.result);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.get("/offset/:handle", async (req, res) => {
  try {
    const handle = parseInt(req.params.handle);
    const message =
      JSON.stringify({
        jsonrpc: "2.0",
        id: 556,
        method: "Pixera.Timelines.Layer.getOffsets",
        params: { handle: handle },
      }) + "0xPX";
    const data = JSON.parse(await sendTcpData(message));
    res.send(data.result);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.put("/offset/:handle", async (req, res) => {
  try {
    const handle = parseInt(req.params.handle);
    const { xOffset, yOffset } = req.body;
    const message =
      JSON.stringify({
        jsonrpc: "2.0",
        id: 557,
        method: "Pixera.Timelines.Layer.setOffsets",
        params: {
          handle: handle,
          x: xOffset,
          y: yOffset,
        },
      }) + "0xPX";
    const answer = JSON.parse(await sendTcpData(message));
    res.send(answer);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.get("/get-resource/:handle", async (req, res) => {
  console.log("RESOURCE");
  try {
    const handle = parseInt(req.params.handle);
    const message =
      JSON.stringify({
        jsonrpc: "2.0",
        id: 531,
        method: "Pixera.Timelines.Layer.getAssignedResource",
        params: { handle: handle },
      }) + "0xPX";
    const data = JSON.parse(await sendTcpData(message));
    res.send(data.result);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.put("/assign-resource", async (req, res) => {
  try {
    const { handle, resid } = req.body;
    const message =
      JSON.stringify({
        jsonrpc: "2.0",
        id: 529,
        method: "Pixera.Timelines.Layer.assignResource",
        params: { handle: parseInt(handle), id: resid },
      }) + "0xPX";
    const answer = JSON.parse(await sendTcpData(message));
    res.send(answer);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.post("/create", async (req, res) => {
  console.log("CREATE LAYER: ", req.body.body);
  try {
    const { timelineHandle, width, height, xPos, yPos, resourceID, left, right, top, bottom, scaleX, scaleY } =
      req.body.body;
    console.log("TIMELINE: ", timelineHandle);
    const layerHandle = await createLayer(timelineHandle);
    const setHomescreenResponse = await setHomescreen(layerHandle);
    const resourceResponse = await assignResourceToLayer(layerHandle, resourceID);
    const effectResponse = await assignCropping(layerHandle);
    const clipHandle = await createClip(layerHandle);
    const offset = await setOffset(layerHandle, xPos, yPos, scaleX, scaleY);
    const descriptionResponse = await setDescription(layerHandle, width, height, xPos, left, right, top, bottom);

    //const resourceResponse = await assignResource(clipHandle, resourceID);

    console.log("LAYERHANDLE: ", layerHandle);
    res.status(201).json({ layerHandle });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

async function createLayer(timelineHandle) {
  console.log("TIMELINE: ", timelineHandle);
  const message =
    JSON.stringify({
      jsonrpc: "2.0",
      id: 438,
      method: "Pixera.Timelines.Timeline.createLayer",
      params: { handle: timelineHandle },
    }) + "0xPX";
  const data = JSON.parse(await sendTcpData(message));
  if (data.error) throw new Error(data.error.message);
  return data.result;
}

// Define the getCropEffect function
async function getCropEffect() {
  try {
    const helper = await pool.query("SELECT data FROM helper WHERE name = $1", ["CroppingHardEdge"]);
    return helper.rows[0]; // Return the first row of the result
  } catch (error) {
    console.error(error.message);
    throw new Error("Error fetching crop effect data from the database");
  }
}

// Define the assignCropping function
async function assignCropping(layerHandle) {
  try {
    // Directly call the getCropEffect function to get the data
    const cropEffectData = await getCropEffect();

    const message =
      JSON.stringify({
        jsonrpc: "2.0",
        id: 550,
        method: "Pixera.Timelines.Layer.addEffectById",
        params: { handle: layerHandle, id: parseInt(cropEffectData.data) }, // Use the data from getCropEffect
      }) + "0xPX";

    const answer = JSON.parse(await sendTcpData(message));
    if (answer.error) throw new Error(answer.error.message);
    return answer;
  } catch (error) {
    console.error(error.message);
    throw new Error("Error in assignCropping function");
  }
}

// Example route that uses assignCropping function
router.post("/assign-cropping", async (req, res) => {
  const { layerHandle } = req.body;
  try {
    const result = await assignCropping(layerHandle);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

async function setDescription(handle, width, height, xPos, left, right, top, bottom) {
  console.log("WIDTH: ", width, height);
  console.log("LEFT: ", left);
  console.log("RIGHT: ", right);

  const message =
    JSON.stringify({
      jsonrpc: "2.0",
      id: 507,
      method: "Pixera.Timelines.Layer.setLayerJsonDescrip",
      params: {
        handle: handle,
        descrip: JSON.stringify({
          //Media: "Media/Player 1 [FULLSCREEN] LEFT",
          Position: { X: 0, Y: 0, Z: 0.0 },
          CroppingHardEdge: { Left: left, Right: right, Top: top, Bottom: bottom, "Mix[%]": 100 },
          Size: { D: 0.0, H: height, W: width },
        }),
        makeAllDominant: true,
      },
    }) + "0xPX";
  const answer = JSON.parse(await sendTcpData(message));
  if (answer.error) throw new Error(answer.error.message);
  return answer;
}

async function createClip(layerHandle) {
  const message =
    JSON.stringify({
      jsonrpc: "2.0",
      id: 539,
      method: "Pixera.Timelines.Layer.createClipAtTime",
      params: { handle: layerHandle, timeInFrames: 1.0 },
    }) + "0xPX";
  const data = JSON.parse(await sendTcpData(message));
  if (data.error) throw new Error(data.error.message);
  return data.result;
}

async function setOffset(handle, xPos, yPos, scaleX, scaleY) {
  const message =
    JSON.stringify({
      jsonrpc: "2.0",
      id: 557,
      method: "Pixera.Timelines.Layer.setOffsets",
      params: {
        handle: handle,
        x: xPos / 500,
        y: yPos / 500,
        xScale: 1.001,
        yScale: scaleY,
      },
    }) + "0xPX";
  const data = JSON.parse(await sendTcpData(message));
  if (data.error) throw new Error(data.error.message);
  return data.result;
}

async function assignResource(clipHande, resourceID) {
  const handleInt = parseInt(clipHande);
  const residInt = parseInt(resourceID);

  console.log("CLIPHANDLE: ", handleInt, "RESID: ", residInt);

  const message =
    JSON.stringify({
      jsonrpc: "2.0",
      id: 581,
      method: "Pixera.Timelines.Clip.assignResource",
      params: { handle: handleInt, id: residInt, setToResourceDuration: 1000 },
    }) + "0xPX";
  const answer = JSON.parse(await sendTcpData(message));
  if (answer.error) throw new Error(answer.error.message);
  return answer;
}

async function assignResourceToLayer(clipHande, resourceID) {
  const handleInt = parseInt(clipHande);
  const residInt = parseInt(resourceID);

  console.log("CLIPHANDLE: ", handleInt, "RESID: ", residInt);

  const message =
    JSON.stringify({
      jsonrpc: "2.0",
      id: 529,
      method: "Pixera.Timelines.Layer.assignResource",
      params: { handle: handleInt, id: residInt },
    }) + "0xPX";
  const answer = JSON.parse(await sendTcpData(message));
  if (answer.error) throw new Error(answer.error.message);
  return answer;
}

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

async function setHomescreen(layerHandle) {
  const message =
    JSON.stringify({
      jsonrpc: "2.0",
      id: 546,
      method: "Pixera.Timelines.Layer.setHomeScreenFromScreenName",
      params: { handle: layerHandle, screenName: "LED Wall" },
    }) + "0xPX";
  const answer = JSON.parse(await sendTcpData(message));
  if (answer.error) throw new Error(answer.error.message);
  return answer;
}

router.put("/add-effect", async (req, res) => {
  try {
    const { handle, resid } = req.body;
    const message =
      JSON.stringify({
        jsonrpc: "2.0",
        id: 550,
        method: "Pixera.Timelines.Layer.addEffectById",
        params: { handle: parseInt(handle), id: resid },
      }) + "0xPX";
    const answer = sendTcpData(message);
    res.send(answer);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.get("/remove/:handle", async (req, res) => {
  try {
    const handle = parseInt(req.params.handle);
    const message =
      JSON.stringify({
        jsonrpc: "2.0",
        id: 497,
        method: "Pixera.Timelines.Layer.removeThis",
        params: { handle: handle },
      }) + "0xPX";
    const data = JSON.parse(await sendTcpData(message));
    res.sendStatus(200).send(data.result);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
