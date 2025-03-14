import express from "express";
import "dotenv/config";
import cors from "cors";
import dbConnection from "./config/dbConnection.js";
import cloundinaryConnect from "./config/cloudinary.js";

const app = express();


// config
// db connection
dbConnection();
// cloundinary connection
cloundinaryConnect()

// middleware
app.use(
  cors({
    origin: "http://localhost:5173/",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(express.json());

const port = process.env.PORT || 4000;

// api routes

// error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "internal server";
  res.status(statusCode).json({ success: false, statusCode, message });
});

app.listen(port, () => console.log(`server is working on ${port}`));
