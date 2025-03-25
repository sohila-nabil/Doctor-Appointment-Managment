import Doctor from "../models/doctorModel.js";
import errorHandler from "../utils/errorHandller.js";

const getDoctors = async (req, res, next) => {
  try {
    const doctors = await Doctor.find({}).select([
      "-password",
      "-email",
    ]);
    if (doctors.length === 0) {
      return next(errorHandler(404, "No available doctors found"));
    }
    res.status(200).json({ success: true, doctors });
  } catch (error) {
    console.error(error);
    next(errorHandler(500, "Failed to fetch doctors"));
  }
};

export { getDoctors };
