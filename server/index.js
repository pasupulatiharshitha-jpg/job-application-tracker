const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const jobRoutes = require("./routes/jobs");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => res.send("Job Tracker API running"));
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);

// DB connect, then start server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("DB connected");
    const port = process.env.PORT || 5000;
    app.listen(port, () => console.log("Server started on port " + port));
  })
  .catch((err) => console.log("DB error:", err.message));
