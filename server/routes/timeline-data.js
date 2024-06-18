const express = require("express");
const router = express.Router();
const pool = require("../db");

router.use(express.json());

// Get all timelines
router.get("/timelines", async (req, res) => {
  try {
    const allTimelines = await pool.query("SELECT * FROM timelines");
    res.json(allTimelines.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get all layers
router.get("/layers", async (req, res) => {
  try {
    const allLayers = await pool.query("SELECT * FROM layers");
    res.json(allLayers.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get all layers from specific timeline
router.get("/layers/:timeline-handle", async (req, res) => {
  try {
    const timelineHandle = req.params;
    const allLayersFromTimeline = await pool.query("SELECT * FROM layers WHERE timeline_handle = $1", [timelineHandle]);
    res.json(allLayersFromTimeline.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/timeline", async (req, res) => {
  try {
    const { handle, name } = JSON.parse(req.body.body);
    const newTimeline = await pool.query("INSERT INTO timelines (handle, name) VALUES($1, $2) RETURNING *", [
      handle,
      name,
    ]);
    res.status(200).json({ message: "Timeline was added!", timeline: newTimeline.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/layer", async (req, res) => {
  try {
    const { handle, timelineHandle, name, posLeft, width, player, zone } = JSON.parse(req.body.body);
    const newLayer = await pool.query(
      "INSERT INTO layers (handle, timeline_handle, name, pos_left, width, player, zone) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [handle, timelineHandle, name, posLeft, width, player, zone]
    );
    res.status(200).json({ message: "Layer was added!", timeline: newLayer.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/timeline", async (req, res) => {
  try {
    const { handle, name } = JSON.parse(req.body.body);
    const timeline = await pool.query("UPDATE timelines SET name = $1 WHERE handle = $2 RETURNING *", [name, handle]);
    res.status(200).json({ message: "Timeline was updated!", timeline: timeline.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/layer", async (req, res) => {
  try {
    const { handle, name, posLeft, width, player, zone } = JSON.parse(req.body.body);
    const layer = await pool.query(
      "UPDATE layers SET name = $1, pos_left = $2, width = $3, player = $4, zone = $5  WHERE handle = $6 RETURNING *",
      [name, posLeft, width, player, zone, handle]
    );
    res.status(200).json({ message: "Layer was updated!", layer: layer.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/update-handle", async (req, res) => {
  const client = await pool.connect();
  try {
    const { newHandle, oldHandle } = JSON.parse(req.body.body);
    await client.query("BEGIN");

    const timeline = await client.query("UPDATE timelines SET handle = $1 WHERE handle = $2 RETURNING *", [
      newHandle,
      oldHandle,
    ]);

    if (timeline.rowCount === 0) {
      throw new Error("Timeline handle not found");
    }

    const layers = await client.query("UPDATE layers SET timeline_handle = $1 WHERE timeline_handle = $2 RETURNING *", [
      newHandle,
      oldHandle,
    ]);

    await client.query("COMMIT");

    res.status(200).json({
      message: "Handle was updated!",
      timeline: timeline.rows[0],
      updatedLayers: layers.rows,
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err.message);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    client.release();
  }
});

module.exports = router;
