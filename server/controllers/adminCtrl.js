import Doctor from "./../models/doctorModel.js";
import errorHandler from "./../utils/errorHandller.js";
import bcrypt from "bcryptjs";
import { v2 as cloundinary } from "cloudinary";
import validator from "validator";
import jwt from "jsonwebtoken";

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

export { addDoctor, adminLogin, getDoctors, changeDoctorAvailability };
