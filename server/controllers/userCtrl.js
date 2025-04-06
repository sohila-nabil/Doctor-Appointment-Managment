import User from "../models/userModel.js";
import errorHandler from "./../utils/errorHandller.js";
import bcrypt from "bcryptjs";
import validator from "validator";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import Doctor from "../models/doctorModel.js";
import Appointment from "../models/appointments.js";

const formatTimeTo12Hour = (time) => {
  const [hours, minutes] = time.split(":");
  let hour = parseInt(hours, 10);
  let period = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;
  return `${hour}:${minutes} ${period}`;
};

const convertTo24Hour = (time12h) => {
  const [time, modifier] = time12h.split(" ");
  let [hours, minutes] = time.split(":").map(Number);
  if (modifier === "PM" && hours !== 12) hours += 12;
  if (modifier === "AM" && hours === 12) hours = 0;
  return { hours, minutes };
};

// user register
const userRegister = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return next(errorHandler(400, "All fields are required"));
    }
    if (!validator.isEmail(email)) {
      return next(errorHandler(400, "Invalid Email"));
    }
    if (password.length < 8) {
      return next(
        errorHandler(400, "Password must be atleast 8 characters long")
      );
    }
    const user = await User.findOne({ email });
    if (user) return next(errorHandler(400, "User already exists"));
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
    res
      .status(201)
      .json({ success: true, message: "User registered successfully", token });
  } catch (error) {
    console.error(error);
    next(errorHandler(500, error.message));
  }
};

// user login
const userLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(errorHandler(400, "All fields are required"));
    }
    if (!validator.isEmail(email)) {
      return next(errorHandler(400, "Email must be valid"));
    }
    const user = await User.findOne({ email });
    if (!user) return next(errorHandler(404, "invalid credentials"));
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return next(errorHandler(401, "invalid credentials"));
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ success: true, message: "Logged in successfully", token });
  } catch (error) {
    console.error(error);
    next(errorHandler(500, error.message));
  }
};

// get user data
const getUser = async (req, res, next) => {
  try {
    const id = req.user;
    const user = await User.findById(id).select("-password");
    if (!user) return next(errorHandler(404, "User not found"));
    res.json({ success: true, user });
  } catch (error) {
    console.error(error);
    next(errorHandler(500, "Failed to fetch user"));
  }
};

// update user data
const updateUser = async (req, res, next) => {
  try {
    const id = req.user?.id || req.user;
    const imageFile = req?.file;

    let user = await User.findById(id);
    if (!user) return next(errorHandler(404, "User not found"));

    // Ensure address is an object (handle both string and object formats)
    let address = req.body.address;
    if (typeof address === "string") {
      try {
        address = JSON.parse(address);
      } catch (error) {
        return next(errorHandler(400, "Invalid address format"));
      }
    }

    // Ensure `user.address` exists and is an object
    if (typeof user.address !== "object" || user.address === null) {
      user.address = { line1: "", line2: "" };
    }

    // Update address fields safely
    if (typeof address === "object" && address !== null) {
      user.address.line1 = address.line1 || user.address.line1 || "";
      user.address.line2 = address.line2 || user.address.line2 || "";
    }

    // Mark `address` as modified to ensure MongoDB updates it
    user.markModified("address");

    // Remove address from req.body before calling user.set()
    const { address: _removeAddress, ...otherFields } = req.body;
    user.set({ ...otherFields, address: user.address });

    // Handle image upload (if new image is provided)
    if (imageFile) {
      if (user.image?.public_id) {
        await cloudinary.uploader.destroy(user.image.public_id);
      }
      const uploadedImage = await cloudinary.uploader.upload(imageFile.path, {
        folder: "user",
      });
      user.image = {
        public_id: uploadedImage.public_id,
        url: uploadedImage.secure_url,
      };
    }

    await user.save();
    res.json({ success: true, message: "User updated successfully", user });
  } catch (error) {
    console.error(error);
    next(errorHandler(500, "Failed to update user"));
  }
};

// const convertTo24Hour = (time12h) => {
//   const [time, modifier] = time12h.split(" ");
//   let [hours, minutes] = time.split(":").map(Number);

//   if (modifier === "PM" && hours !== 12) {
//     hours += 12;
//   }
//   if (modifier === "AM" && hours === 12) {
//     hours = 0;
//   }

//   return { hours, minutes };
// };

// user book appointment
// const bookAppointment = async (req, res, next) => {
//   try {
//     const { date, time, doctorId } = req.body;
//     const id = req.user;
//     if (!date || !time || !doctorId) {
//       return next(errorHandler(400, "All fields are required"));
//     }
//     const user = await User.findById(id).select("-password");
//     if (!user) return next(errorHandler(404, "User not found"));

//     const doctor = await Doctor.findById(doctorId).select("-password");
//     if (!doctor) return next(errorHandler(404, "Doctor not found"));
//     if (!doctor.available)
//       return next(errorHandler(400, "Doctor is not available"));
//     if (date < new Date()) return next(errorHandler(400, "Invalid date"));
//     if (time < new Date()) return next(errorHandler(400, "Invalid time"));
//     if (doctorId === id)
//       return next(
//         errorHandler(400, "You cannot book appointment with yourself")
//       );
//     if (doctor.workingHours.length === 0) {
//       return next(errorHandler(400, "Doctor is not available"));
//     }
//     const appointmentDate = new Date(date);
//     if (appointmentDate < new Date()) {
//       return next(errorHandler(400, "Invalid date"));
//     }

//     const appointmentTime = new Date(`${date} ${time}`);
//     if (appointmentTime < new Date()) {
//       return next(errorHandler(400, "Invalid time"));
//     }

//     const appointmentDay = appointmentDate.toLocaleDateString("en-US", {
//       weekday: "long",
//     });

//     const workingDay = doctor.workingHours.find(
//       (d) => d.day === appointmentDay
//     );
//     if (!workingDay) {
//       return next(
//         errorHandler(400, `Doctor does not work on ${appointmentDay}`)
//       );
//     }
//     console.log(workingDay.startTime, " workingDay.startTime");
//     console.log(workingDay.endTime, " workingDay.endTime");

//     // const [startHour, startMin] = workingDay.startTime.split(":");
//     // const [endHour, endMin] = workingDay.endTime.split(":");
//     const { hours: startHour, minutes: startMin } = convertTo24Hour(
//       workingDay.startTime
//     );
//     const { hours: endHour, minutes: endMin } = convertTo24Hour(
//       workingDay.endTime
//     );
//     console.log(startHour, startMin, " startHour, startMin");
//     console.log(endHour, endMin, " endHour, endMin");

//     const workingStartTime = new Date(appointmentDate);
//     workingStartTime.setHours(parseInt(startHour), parseInt(startMin), 0);
//     console.log(workingStartTime, " workingStartTime");
//     console.log(appointmentTime, " appointmentTime");

//     const workingEndTime = new Date(appointmentDate);
//     workingEndTime.setHours(parseInt(endHour), parseInt(endMin), 0);
//     console.log(workingEndTime, " workingEndTime");
//     console.log(appointmentTime, " appointmentTime");

//     if (
//       appointmentTime < workingStartTime ||
//       appointmentTime > workingEndTime
//     ) {
//       return next(
//         errorHandler(
//           400,
//           `Doctor is available from ${workingDay.startTime} to ${workingDay.endTime} on ${appointmentDay}`
//         )
//       );
//     }

//     const appointment = {
//       date,
//       time: formatTimeTo12Hour(time),
//       doctorId: doctor._id,
//       id: user._id,
//       status: "pending",
//       amount: doctor.fees,
//       appointementDate: Date.now(),
//     };

//     // Check if appointment already exists
//     const existingAppointment = await Appointment.findOne({
//       date,
//       time,
//       doctorId,
//     });
//     if (existingAppointment) {
//       return next(errorHandler(400, "Appointment already exists"));
//     }
//     const newAppointment = new Appointment(appointment);
//     await newAppointment.save();

//     user.appointments.push(newAppointment._id);
//     await user.save();
//     doctor.appointments.push(newAppointment._id);
//     await doctor.save();
//     res.json({ success: true, message: "Appointment booked successfully" });
//   } catch (error) {
//     console.error(error);
//     next(errorHandler(500, "Failed to book appointment"));
//   }
// };

const bookAppointment = async (req, res, next) => {
  try {
    const { date, time, doctorId } = req.body;
    const id = req.user;

    if (!date || !time || !doctorId) {
      return next(errorHandler(400, "All fields are required"));
    }

    const user = await User.findById(id).select("-password");
    if (!user) return next(errorHandler(404, "User not found"));

    const doctor = await Doctor.findById(doctorId).select("-password");
    if (!doctor) return next(errorHandler(404, "Doctor not found"));

    if (!doctor.available)
      return next(errorHandler(400, "Doctor is not available"));

    const appointmentDate = new Date(date);
    if (appointmentDate < new Date())
      return next(errorHandler(400, "Invalid date"));

    const appointmentTime = new Date(`${date} ${time}`);
    if (appointmentTime < new Date())
      return next(errorHandler(400, "Invalid time"));

    // Get working hours of the doctor
    const appointmentDay = appointmentDate.toLocaleDateString("en-US", {
      weekday: "long",
    });
    const workingDay = doctor.workingHours.find(
      (d) => d.day === appointmentDay
    );

    if (!workingDay)
      return next(
        errorHandler(400, `Doctor does not work on ${appointmentDay}`)
      );

    const { hours: startHour, minutes: startMin } = convertTo24Hour(
      workingDay.startTime
    );
    const { hours: endHour, minutes: endMin } = convertTo24Hour(
      workingDay.endTime
    );

    const workingStartTime = new Date(appointmentDate);
    workingStartTime.setHours(startHour, startMin, 0);

    const workingEndTime = new Date(appointmentDate);
    workingEndTime.setHours(endHour, endMin, 0);

    if (
      appointmentTime < workingStartTime ||
      appointmentTime > workingEndTime
    ) {
      return next(
        errorHandler(
          400,
          `Doctor is available from ${workingDay.startTime} to ${workingDay.endTime} on ${appointmentDay}`
        )
      );
    }

    // Check if appointment already exists
    const existingAppointment = await Appointment.findOne({
      date,
      time,
      doctorId,
      status: "pending",
      isCancelled: false,
    });
    if (existingAppointment)
      return next(errorHandler(400, "Appointment already exists"));

    const newAppointment = new Appointment({
      date,
      time: formatTimeTo12Hour(time),
      doctorId: doctor._id,
      userId: user._id,
      status: "pending",
      amount: doctor.fees,
      appointmentDate: Date.now(),
    });

    await newAppointment.save();

    user.appointments.push(newAppointment._id);
    await user.save();
    doctor.appointments.push(newAppointment._id);
    await doctor.save();

    res.json({
      success: true,
      message: "Appointment booked successfully",
      appointment: newAppointment,
    });
  } catch (error) {
    console.log(error);
    next(errorHandler(500, error));

  }
};

const getUserAppointments = async (req, res, next) => {
  try {
    const id = req.user;
    const user = await User.findById(id);
    if (!user) return next(errorHandler(404, "User not found"));
    const appointments = await Appointment.find({
      userId: id,
      // status: "pending" || "accepted",
      // isCancelled: false,
    }).populate({
      path: "doctorId",
      select: "-password",
    });
    if (appointments.length === 0)
      return next(errorHandler(404, "no appointments found"));
    res.json({ success: true, appointments });
  } catch (error) {
    console.error(error);
    next(errorHandler(500, "Failed to get user Appointments "));
  }
};

const cancelAppointment = async (req, res, next) => {
  try {
    const id = req.user;
    const appointmentId = req.params.appointmentId;
    const appointment = await Appointment.findOne({
      _id: appointmentId,
      userId: id,
    });
    if (!appointment) return next(errorHandler(404, "Appointment not found"));
    appointment.status = "cancelled";
    appointment.isCancelled = true;
    await appointment.save();
    res.json({ success: true, message: "Appointment cancelled successfully" });
  } catch (error) {
    console.error(error);
    next(errorHandler(500, "Failed to get user Appointments "));
  }
};

export {
  userRegister,
  userLogin,
  getUser,
  updateUser,
  bookAppointment,
  getUserAppointments,
  cancelAppointment,
};
