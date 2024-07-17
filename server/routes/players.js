// Database requests regarding players

const express = require("express");
const router = express.Router();
const pool = require("../db");

router.use(express.json());

// Get all players
router.get("/", async (req, res) => {
  try {
    const allPlayers = await pool.query("SELECT * FROM players ORDER BY player_id ASC");
    res.json(allPlayers.rows);
  } catch (err) {
    console.error(err.message);
  }
});

// Get a player
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const player = await pool.query("SELECT * FROM players WHERE player_id = $1", [id]);
    res.json(player.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

// Update a player
router.put("/", async (req, res) => {
  console.log("PLAYER: ", req.body.body);
  try {
    const { playerId, name, input, resourceHandle } = JSON.parse(req.body.body);

    const updatePlayer = await pool.query(
      "UPDATE players SET name = $1, input = $2, resource_handle = $3 WHERE player_id = $4 RETURNING *",
      [name, input, resourceHandle, playerId]
    );
    res.status(200).json({ message: "Player was updated!", player: updatePlayer.rows[0] });
  } catch (err) {
    console.error("Error while trying to update player: ", err.message);
  }
});

module.exports = router;

/*

*/
