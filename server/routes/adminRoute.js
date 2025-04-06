import {
  addDoctor,
  adminLogin,
  getDoctors,
  changeDoctorAvailability,
  getAllAppointments,
  deleteDoctor,
  getCounts,
} from "../controllers/adminCtrl.js";
import authAdmin from "../middlewares/authAdmin.js";
import upload from "../middlewares/multer.js";
import { Router } from "express";

const adminRouter = Router();

adminRouter.post("/add-doctor", authAdmin, upload.single("image"), addDoctor);
adminRouter.post("/login", adminLogin);

adminRouter.get("/doctors", authAdmin, getDoctors);
adminRouter.get("/appointments", authAdmin, getAllAppointments);
adminRouter.get("/counts", getCounts);

adminRouter.put("/doctor/:id", authAdmin, changeDoctorAvailability);

adminRouter.delete("/delete-doctor/:id", authAdmin, deleteDoctor);

export default adminRouter;
