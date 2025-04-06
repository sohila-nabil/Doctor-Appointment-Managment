import Appointment from './../models/appointments.js';
import errorHandler from './../utils/errorHandller.js';

const getAppointmentById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findById(id)
      .populate("userId", "name email phone")
      .populate("doctorId", "name speciality image address");

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    res.json({
      success: true,
      appointment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Cancel an appointment
const cancelAppointment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findOne({
      _id: id,
    });
    console.log(id);
    console.log(appointment);
    
    if (!appointment) return next(errorHandler(404, "Appointment not found"));
    appointment.status = "cancelled";
    appointment.isCancelled = true;
    appointment.isCompleted = false;
    await appointment.save();
    res.json({ success: true, message: "Appointment cancelled successfully" });
  } catch (error) {
    console.error(error);
    next(errorHandler(500, "Failed to get user Appointments "));
  }
};

const getLatestAppointments = async(req,res,next)=>{
  try {
    const appointments = await Appointment.find({}).sort({createdAt:-1}).limit(5).populate("doctorId", "name image").exec();
    res.json({ success: true, appointments });
  } catch (error) {
    console.log(error);
    next(errorHandler(500, error.message));
    
  }
}

const getLatestAppointmentsOfDoctor = async (req, res, next) => {
  try {
    const appointments = await Appointment.find({doctorId: req.params.id})
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("doctorId", "name image")
      .exec();
    res.json({ success: true, appointments });
  } catch (error) {
    console.log(error);
    next(errorHandler(500, error.message));
  }
};
export {
  getAppointmentById,
  cancelAppointment,
  getLatestAppointments,
  getLatestAppointmentsOfDoctor,
};