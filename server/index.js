import express from "express";
import "dotenv/config";
import cors from "cors";
import dbConnection from "./config/dbConnection.js";
import cloundinaryConnect from "./config/cloudinary.js";
import adminRouter from "./routes/adminRoute.js";
import doctorRouter from "./routes/doctorRoute.js";
import userRouter from "./routes/userRoute.js";
import paypalRouter from "./routes/paypalRoute.js";
import paymentRoutes from "./routes/paymentRoutes.js";

const app = express();

// config
// db connection
dbConnection();
// cloundinary connection
cloundinaryConnect();

// middleware
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(express.json());

const port = process.env.PORT || 4000;

// api routes
app.use("/api/admin", adminRouter);
app.use("/api/doctor", doctorRouter);
app.use("/api/user", userRouter);
app.use("/api/pay", paypalRouter);
app.use("/api/payments", paymentRoutes);



// error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "internal server";
  res.status(statusCode).json({ success: false, statusCode, message });
});

app.listen(port, () => console.log(`server is working on ${port}`));
