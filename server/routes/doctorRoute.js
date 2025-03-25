import { getDoctors } from "../controllers/doctorCtrl.js";
import { Router } from "express";

const doctorRouter = Router();

doctorRouter.get("/", getDoctors);

export default doctorRouter;
