const express = require("express");
const cors = require("cors");
const User = require("./models/user");
const Task = require("./models/task");
require("./db/mongoose");

// Routers
const userRouter = require("./routes/user");
const taskRouter = require("./routes/task");

// initializing port with heroku/local
const port = process.env.PORT;

const app = express();
app.use(cors());

// enabling express to convert json to objects
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Router calls
app.use(userRouter);
app.use(taskRouter);

// server
app.listen(port, () => console.log("Server up and running at port ", port));
