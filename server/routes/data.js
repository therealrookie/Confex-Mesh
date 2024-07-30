// All Database requests

const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/hardware-data", async (req, res) => {
  try {
    const data = await pool.query("SELECT * FROM helper ORDER BY id ASC");
    res.json(data.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server error" });
  }
});

// Get all matrices
router.get("/matrices", async (req, res) => {
  try {
    const matrices = await pool.query("SELECT * FROM matrices ORDER BY matrix_id ASC");
    res.json(matrices.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get all zones from specific timeline by ID
router.get("/zones/:matrixid", async (req, res) => {
  try {
    const matrixId = req.params.matrixid;
    console.log("MATRIX ID: ", matrixId);
    const zonesOfMatrix = await pool.query("SELECT * FROM zones WHERE matrix_id = $1", [matrixId]);
    res.json(zonesOfMatrix.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get zone from zone_id
router.get("/zone/:zoneid", async (req, res) => {
  try {
    const zoneId = req.params.zoneid;
    const zone = await pool.query("SELECT * FROM zones WHERE zone_id = $1", [zoneId]);
    res.json(zone.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Add new matrix to Matrix-table
router.post("/matrix", async (req, res) => {
  try {
    const { timelineHandle, name } = JSON.parse(req.body.body);
    console.log("DATA: ", timelineHandle, name);
    const newTimeline = await pool.query("INSERT INTO matrices (timeline_handle, name) VALUES($1, $2) RETURNING *", [
      timelineHandle,
      name,
    ]);
    res.status(200).json({ message: "Matrix was added!", matrix: newTimeline.rows[0] });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Add new layer to Layer-table
router.post("/zone", async (req, res) => {
  try {
    const { matrixId, playerId, layerHandle, posLeft, section } = JSON.parse(req.body.body);
    const newZone = await pool.query(
      "INSERT INTO zones (matrix_id, player_id, layer_handle, pos_left, section) VALUES($1, $2, $3, $4, $5) RETURNING *",
      [matrixId, playerId, layerHandle, posLeft, section]
    );
    res.status(200).json({ message: "Zone was added!", zone: newZone.rows[0] });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Update name of Matrix in Matrix-table
router.put("/matrix-name", async (req, res) => {
  try {
    const { matrixId, name } = JSON.parse(req.body.body);
    const matrix = await pool.query("UPDATE matrices SET name = $1 WHERE matrix_id = $2 RETURNING *", [name, matrixId]);
    res.status(200).json({ message: "Matrix was updated!", matrix: matrix.rows[0] });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/update-zone", async (req, res) => {
  try {
    console.log("BODY: ", req.body);
    const { playerId, layerHandle, section, zoneId } = req.body;
    const layer = await pool.query(
      "UPDATE zones SET player_id = $1, layer_handle = $2, section = $3 WHERE zone_id = $4 RETURNING *",
      [playerId, layerHandle, section, zoneId]
    );
    res.status(200).json({ message: "Layer was updated!", layer: layer.rows[0] });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Update timeline_handle
router.put("/update-handle", async (req, res) => {
  try {
    const { newTimelineHandle, matrixId } = JSON.parse(req.body.body);
    const matrix = await pool.query("UPDATE matrices SET timeline_handle = $1 WHERE matrix_id = $2 RETURNING *", [
      newTimelineHandle,
      matrixId,
    ]);
    res.status(200).json({
      message: "Handle was updated!",
      matrix: matrix.rows[0],
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete matrix and zones
router.delete("/delete-matrix/:matrixId", async (req, res) => {
  try {
    const matrixId = req.params.matrixId;
    const delMatrix = await pool.query("DELETE FROM matrices WHERE matrix_id = $1", [matrixId]);
    const delZone = await pool.query("DELETE FROM zones WHERE matrix_id = $1", [matrixId]);
    res.status(200).json({ message: "Matrix was deleted!", matrix: delMatrix, zones: delZone });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/update-effect", async (req, res) => {
  try {
    const { effectName, effectHandle } = JSON.parse(req.body.body);
    console.log(effectHandle);
    const helper = await pool.query("UPDATE helper SET data = $1 WHERE name = $2 RETURNING *", [
      effectHandle,
      effectName,
    ]);
    res.status(200).json({
      message: "Effect was updated!",
      helper: helper.rows[0],
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

async function getCropEffect(req, res) {
  try {
    const helper = await pool.query("SELECT data FROM helper WHERE name = $1", ["CroppingHardEdge"]);
    return res.json(helper.rows); // Send the data as a JSON response
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: "Internal Server Error" }); // Properly handle the error response
  }
}

router.get("/crop-effect", getCropEffect);

// Get Novastar main IP
router.get("/novastar/main", async (req, res) => {
  try {
    const ip = await pool.query("SELECT * FROM helper WHERE name = $1", ["IP Novastar (main)"]);
    res.json(ip.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get Novastar backup (hot) IP
router.get("/novastar/hot", async (req, res) => {
  try {
    const ip = await pool.query("SELECT * FROM helper WHERE name = $1", ["IP Novastar (backup hot)"]);
    res.json(ip.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get Novastar backup (cold) IP
router.get("/novastar/cold", async (req, res) => {
  try {
    const ip = await pool.query("SELECT * FROM helper WHERE name = $1", ["IP Novastar (backup cold)"]);
    res.json(ip.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
module.exports = router;
