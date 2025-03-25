import {
  addDoctor,
  adminLogin,
  getDoctors,
  changeDoctorAvailability,
} from "../controllers/adminCtrl.js";
import authAdmin from "../middlewares/authAdmin.js";
import upload from "../middlewares/multer.js";
import { Router } from "express";

const adminRouter = Router();

adminRouter.post("/add-doctor", authAdmin, upload.single("image"), addDoctor);
adminRouter.post("/login", adminLogin);
adminRouter.get("/doctors", authAdmin, getDoctors);
adminRouter.put("/doctor/:id", authAdmin, changeDoctorAvailability);

export default adminRouter;
