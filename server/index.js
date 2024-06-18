const express = require("express");
const cors = require("cors");
const app = express();

const port = 5000;

// middleware
app.use(cors());
app.use(express.json());

// Routes
const userRouter = require("./routes/users");
const novastarRouter = require("./routes/novastar");
const pixeraRouter = require("./routes/pixera");
const playerRouter = require("./routes/players");

app.use("/users", userRouter);
app.use("/novastar", novastarRouter);
app.use("/pixera", pixeraRouter);
app.use("/players", playerRouter);

app.listen(port, () => {
  console.log(`Server started on Port ${port}`);
});
