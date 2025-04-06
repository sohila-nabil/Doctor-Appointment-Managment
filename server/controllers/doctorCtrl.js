import Doctor from "../models/doctorModel.js";
import errorHandler from "../utils/errorHandller.js";
import { v2 as cloudinary } from "cloudinary";
import validator from "validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Appointment from "./../models/appointments.js";
import { set } from "mongoose";

const doctorLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);

    if (!email || !password) {
      return next(errorHandler(400, "All fields are required"));
    }
    if (!validator.isEmail(email)) {
      return next(errorHandler(400, "Email must be valid"));
    }

    const doctor = await Doctor.findOne({ email });
    if (!doctor) {
      return next(errorHandler(404, "Doctor not found"));
    }

    const isMatch = await bcrypt.compare(password, doctor.password);
    if (!isMatch) {
      return next(errorHandler(401, "Invalid credentials"));
    }

    const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET);
    res.json({ success: true, message: "Logged in successfully", token });
  } catch (error) {
    console.error(error);
    next(errorHandler(500, "Failed to login"));
  }
};
const getDoctors = async (req, res, next) => {
  try {
    const doctors = await Doctor.find({}).select(["-password", "-email"]);
    if (doctors.length === 0) {
      return next(errorHandler(404, "No available doctors found"));
    }
    res.status(200).json({ success: true, doctors });
  } catch (error) {
    console.error(error);
    next(errorHandler(500, "Failed to fetch doctors"));
  }
};

const getDoctor = async (req, res, next) => {
  try {
    const { id } = req.params;
    const doctor = await Doctor.findById(id).select(["-password"]);
    if (!doctor) {
      return next(errorHandler(404, "Doctor not found"));
    }
    res.status(200).json({ success: true, doctor });
  } catch (error) {
    console.error(error);
    next(errorHandler(500, "Failed to fetch doctor details"));
  }
};

const updateDoctor = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { ...data } = req.body;
    const imageFile = req.file;
    const doctor = await Doctor.findById(id);
    if (!doctor) {
      return next(errorHandler(404, "Doctor not found"));
    }
    const updatedDoctor = await Doctor.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (!updatedDoctor) {
      return next(errorHandler(404, "Failed to update doctor details"));
    }
    if (imageFile) {
      // Delete previous image from Cloudinary if exists
      if (doctor.image && doctor.image.public_id) {
        await cloudinary.uploader.destroy(doctor.image.public_id);
      }
      const result = await cloudinary.uploader.upload(imageFile.path, {
        folder: "doctors",
      });
      updatedDoctor.image = {
        public_id: result.public_id,
        url: result.secure_url,
      };
      await updatedDoctor.save();
    }
    res.status(200).json({ success: true, doctor });
  } catch (error) {
    console.error(error);
    next(errorHandler(500, "Failed to update doctor details"));
  }
};

const getAppointmentsForDoctor = async (req, res, next) => {
  try {
    const { id } = req.doctor;

    const doctor = await Doctor.findById(id)
      .select("-password")
      .populate({
        path: "appointments",
        populate: [
          { path: "userId", select: "-password" },
          { path: "doctorId", select: "-password" },
        ],
      })
      .sort({ createdAt: -1 });
    if (!doctor) {
      return next(errorHandler(404, "Doctor not found"));
    }
    if (doctor.appointments.length === 0)
      return next(errorHandler(404, "No appointments found for this doctor"));
    const uniqueUserIds = new Set(
      doctor.appointments.map((appointment) =>
        appointment.userId?._id?.toString()
      )
    );

    const uniquePatientCount = uniqueUserIds.size;
    res.status(200).json({
      success: true,
      appointments: doctor.appointments,
      patientCount: uniquePatientCount,
    });
  } catch (error) {
    console.error(error);
    next(errorHandler(500, "Failed to fetch appointments for doctor"));
  }
};

const getAllAppointments = async (req, res, next) => {
  try {
    const id = req.doctor;
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;

    const filter = {
      doctorId: id, // Only this doctor’s appointments
    };

    // Search by patient or doctor name
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, "i");
      filter.$or = [
        { "userId.name": searchRegex },
        { "doctorId.name": searchRegex },
      ];
    }

    // Filter by status
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

    // Filter by date
    if (req.query.date) {
      filter.date = req.query.date;
    }

    // Get total count
    const totalAppointments = await Appointment.countDocuments(filter);

    // Fetch appointments
    const appointments = await Appointment.find(filter)
      .populate("userId", "name email")
      .populate("doctorId", "name speciality image address")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    // Fix for creating unique set of patient _id
    const uniquePatientCount = new Set(
      appointments
        .map((appointment) => appointment.userId?._id.toString())
        .filter(Boolean)
    );

    res.json({
      success: true,
      currentPage: page,
      totalPages: Math.ceil(totalAppointments / limit),
      totalAppointments,
      appointments,
      uniquePatientCount: uniquePatientCount.size,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};


export {
  getDoctors,
  getDoctor,
  updateDoctor,
  getAppointmentsForDoctor,
  doctorLogin,
  getAllAppointments,
};
