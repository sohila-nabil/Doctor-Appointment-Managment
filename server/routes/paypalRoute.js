import { Router } from "express";
import { captureOrder, createOrder } from "../controllers/paypalCtrl.js";

const paypalRouter = Router();
// /:orderId
paypalRouter.post("/capture-order", captureOrder);
paypalRouter.post("/create-order", createOrder);

export default paypalRouter;
