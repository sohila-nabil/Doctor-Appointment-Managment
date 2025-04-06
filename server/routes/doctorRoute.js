import {
  getDoctors,
  getDoctor,
  getAppointmentsForDoctor,
  doctorLogin,
  getAllAppointments,
} from "../controllers/doctorCtrl.js";
import { Router } from "express";
import authDoctor from "./../middlewares/authDoctor.js";

const doctorRouter = Router();

doctorRouter.get("/", getDoctors);
doctorRouter.get("/:id", getDoctor);
doctorRouter.get("/doc/appointments", authDoctor, getAllAppointments);

doctorRouter.post("/login", doctorLogin);

export default doctorRouter;
