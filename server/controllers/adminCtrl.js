import Doctor from "../models/doctorModel.js";
import errorHandler from "../utils/errorHandller.js";
import bcrypt from "bcryptjs";
import { v2 as cloundinary } from "cloudinary";
import validator from "validator";
import jwt from "jsonwebtoken";
import Appointment from "../models/appointments.js";
import User from "../models/userModel.js";

const formatTimeTo12Hour = (time) => {
  const [hours, minutes] = time.split(":");
  let hour = parseInt(hours, 10);
  let period = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;
  return `${hour}:${minutes} ${period}`;
};

const addDoctor = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      speciality,
      degree,
      experience,
      about,
      available,
      fees,
      workingHours,
      line1,
      line2,
    } = req.body;
    // const { } = JSON.parse(req.body.address);
    const imageFile = req.file;

    if (
      !name ||
      !email ||
      !speciality ||
      !degree ||
      !experience ||
      !about ||
      !available ||
      !fees
    ) {
      return next(errorHandler(400, "all fields are required"));
    }

    if (!validator.isEmail(email)) {
      return next(
        errorHandler(
          400,
          "Invalid email format. Please enter a valid email address."
        )
      );
    }

    if (password.length < 8) {
      return next(
        errorHandler(400, "Password must be at least 8 characters long.")
      );
    }

    const existingDoctor = await Doctor.findOne({ email });
    if (existingDoctor) {
      return next(errorHandler(400, "Email already exists"));
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const uploadedImage = await cloundinary.uploader.upload(imageFile.path, {
      folder: "Doctors",
      resource_type: "image",
    });

    const doctor = new Doctor({
      name,
      email,
      password: hashedPassword,
      speciality,
      degree,
      experience,
      about,
      available,
      fees,
      address: { line1, line2 },
      image: {
        public_id: uploadedImage.public_id,
        url: uploadedImage.secure_url,
      },
      workingHours: JSON.parse(workingHours).map((item) => ({
        day: item.day,
        startTime: formatTimeTo12Hour(item.startTime),
        endTime: formatTimeTo12Hour(item.endTime),
      })),
      date: Date.now(),
    });
    await doctor.save();
    res
      .status(201)
      .json({ success: true, message: "Doctor added successfully" });
  } catch (error) {
    console.error(error);
    console.log(error);

    res.status(400).json({ success: false, message: error });
  }
};

const adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (
      email !== process.env.ADMIN_EMAIL ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      return next(errorHandler(401, "Invalid Credintials"));
    }

    const token = jwt.sign(email + password, process.env.JWT_SECRET);
    res.json({ success: true, token });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: error });
  }
};

const getDoctors = async (req, res, next) => {
  try {
    const doctors = await Doctor.find({}).select("-password");
    if (doctors.length === 0)
      return next(errorHandler(404, "No doctors found"));
    res.json({ success: true, doctors });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error });
  }
};

const changeDoctorAvailability = async (req, res, next) => {
  try {
    const { id } = req.params;
    const doctor = await Doctor.findById(id);
    if (!doctor) return next(errorHandler(404, "Doctor not found"));
    doctor.available = !doctor.available;
    await doctor.save();
    res.json({ success: true, message: "Doctor availability changed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error });
  }
};

const getAllAppointments = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = {};

    // Search functionality
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, "i");
      filter.$or = [
        { "userId.name": searchRegex },
        { "doctorId.name": searchRegex },
      ];
    }

    // Status filter
    if (req.query.status) {
      switch (req.query.status) {
        case "paid":
          filter.isPaid = true;
          filter.isCancelled = false;
          break;
        case "pending":
          filter.isPaid = false;
          filter.isCancelled = false;
          break;
        case "cancelled":
          filter.isCancelled = true;
          break;
      }
    }

    // Date filter
    if (req.query.date) {
      filter.date = req.query.date;
    }

    // Count total appointments with filters
    const totalAppointments = await Appointment.countDocuments(filter);

    // Get appointments with filters, pagination, and populate user and doctor details
    const appointments = await Appointment.find(filter)
      .populate("userId", "name email")
      .populate("doctorId", "name speciality image address")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    if (appointments.length === 0 && page === 1) {
      return res.json({
        success: true,
        currentPage: page,
        totalPages: 0,
        totalAppointments: 0,
        appointments: [],
      });
    }

    res.json({
      success: true,
      currentPage: page,
      totalPages: Math.ceil(totalAppointments / limit),
      totalAppointments,
      appointments,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteDoctor = async (req, res, next) => {
  try {
    const id = req.params.id;
    const doctor = await Doctor.findById(id);
    if (!doctor) return next(errorHandler(404, "Doctor not found"));
    if (doctor.image.public_id) {
      await cloundinary.uploader.destroy(doctor.image.public_id);
    }
    await doctor.deleteOne();
    res
      .status(200)
      .json({ success: true, message: "Doctor deleted successfully" });
  } catch (error) {
    console.log(error);
    next(errorHandler(500, "Failed to delete doctor"));
  }
};

// const getAllAppointments = async (req, res, next) => {
//   try {
//     const page = parseInt(req.query.page) || 1;
//     const limit = 5;
//     const skip = (page - 1) * limit;

//     const filter = {};

//     // Status filter
//     if (req.query.status) {
//       switch (req.query.status) {
//         case "paid":
//           filter.isPaid = true;
//           filter.isCancelled = false;
//           break;
//         case "pending":
//           filter.isPaid = false;
//           filter.isCancelled = false;
//           break;
//         case "cancelled":
//           filter.isCancelled = true;
//           break;
//       }
//     }

//     // Date filter
//     if (req.query.date) {
//       filter.date = req.query.date;
//     }

//     const searchRegex = req.query.search
//       ? new RegExp(req.query.search, "i")
//       : null;

//     // Start building aggregation pipeline
//     const pipeline = [
//       { $match: filter },

//       // Join with user collection
//       {
//         $lookup: {
//           from: "users",
//           localField: "userId",
//           foreignField: "_id",
//           as: "userId",
//         },
//       },
//       { $unwind: "$userId" },

//       // Join with doctor collection
//       {
//         $lookup: {
//           from: "doctors",
//           localField: "doctorId",
//           foreignField: "_id",
//           as: "doctorId",
//         },
//       },
//       { $unwind: "$doctorId" },
//     ];

//     // Apply search filter
//     if (searchRegex) {
//       pipeline.push({
//         $match: {
//           $or: [
//             { "userId.name": searchRegex },
//             { "doctorId.name": searchRegex },
//           ],
//         },
//       });
//     }

//     // Count total
//     const totalAppointments = await Appointment.aggregate([
//       ...pipeline,
//       { $count: "total" },
//     ]);
//     const total = totalAppointments[0]?.total || 0;

//     // Add pagination and sorting
//     pipeline.push({ $sort: { createdAt: -1 } });
//     pipeline.push({ $skip: skip });
//     pipeline.push({ $limit: limit });

//     const appointments = await Appointment.aggregate(pipeline);

//     res.json({
//       success: true,
//       currentPage: page,
//       totalPages: Math.ceil(total / limit),
//       totalAppointments: total,
//       appointments,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

const getCounts = async (req, res, next) => {
  try {
    const doctorCount = await Doctor.countDocuments();
    const appointmentCount = await Appointment.countDocuments();
    const userCount = await User.countDocuments();
    res.json({ success: true, doctorCount, appointmentCount, userCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export {
  addDoctor,
  adminLogin,
  getDoctors,
  changeDoctorAvailability,
  getAllAppointments,
  deleteDoctor,
  getCounts,
};
