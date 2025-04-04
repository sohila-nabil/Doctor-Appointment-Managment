import { Router } from "express";
import {
  userRegister,
  userLogin,
  getUser,
  updateUser,
  bookAppointment,
  getUserAppointments,
  cancelAppointment,
} from "../controllers/userCtrl.js";
import authUser from "../middlewares/authUser.js";
import upload from "../middlewares/multer.js";

const userRouter = Router();

userRouter.post("/register", userRegister);
userRouter.post("/login", userLogin);
userRouter.post("/book-appointment", authUser, bookAppointment);
userRouter.get("/getuser", authUser, getUser);
userRouter.get("/getuser-appointments", authUser, getUserAppointments);
userRouter.put("/update-user", authUser, upload.single("image"), updateUser);
userRouter.put(
  "/cancel-appointment/:appointmentId",
  authUser,
  cancelAppointment
);

export default userRouter;
