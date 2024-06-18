const express = require("express");
const router = express.Router();
const pool = require("../db");

// Create a user
router.post("/", async (req, res) => {
  try {
    const { firstName, lastName, email, password, language } = req.body;
    const newUser = await pool.query(
      "INSERT INTO users (first_name, last_name, email, password, language) VALUES($1, $2, $3, $4, $5) RETURNING *",
      [firstName, lastName, email, password, language]
    );
    res.json(newUser.rows[0]);
  } catch (err) {
    console.error("ServerFehler: ", err.message);
  }
});

// Get all users
router.get("/", async (req, res) => {
  try {
    const allUsers = await pool.query("SELECT * FROM users");
    res.json(allUsers.rows);
  } catch (err) {
    console.error(err.message);
  }
});

// Get a user
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await pool.query("SELECT * FROM users WHERE user_id= $1", [id]);
    res.json(user.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

// Update a user
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, language } = req.body;
    const updateUser = await pool.query(
      "UPDATE users SET first_name = $1, last_name = $2, email = $3, language = $4 WHERE user_id = $5 RETURNING *",
      [firstName, lastName, email, language, id]
    );
    res.json("User was updated!");
  } catch (err) {
    console.error(err.message);
  }
});

// Delete a user
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleteUser = await pool.query("DELETE FROM users WHERE user_id = $1", [id]);
    res.json("User was deleted!");
  } catch (err) {
    console.error(err.message);
  }
});

module.exports = router;
