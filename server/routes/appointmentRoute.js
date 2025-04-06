import { Router } from "express";
import {
  getAppointmentById,
  cancelAppointment,
  getLatestAppointments,
  getLatestAppointmentsOfDoctor
} from "../controllers/appointmentCtrl.js";

const appointmentRouter = Router();

appointmentRouter.get("/:id", getAppointmentById);
appointmentRouter.get("/latest/appointments", getLatestAppointments);
appointmentRouter.get("/doctors/:id", getLatestAppointmentsOfDoctor);


appointmentRouter.put("/:id/cancel", cancelAppointment);

export default appointmentRouter;
