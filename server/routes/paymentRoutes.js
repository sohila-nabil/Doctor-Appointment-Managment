import express from "express";
import {
  createPaymentOrder,
  capturePayment,
} from "../controllers/paymentController.js";
import authUser from "../middlewares/authUser.js";
const paymentRoutes = express.Router();

paymentRoutes.post("/create-order", authUser, createPaymentOrder);
paymentRoutes.post("/capture-payment", authUser, capturePayment);

export default paymentRoutes;
