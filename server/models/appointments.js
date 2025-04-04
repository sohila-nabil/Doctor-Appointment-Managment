import mongoose from "mongoose";

const appointement = new mongoose.Schema(
  {
    date: { type: String, required: true },
    time: { type: String, required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    status: { type: String, default: "pending" },
    isCancelled: { type: Boolean, default: false },
    isCompleted: { type: Boolean, default: false },
    amount: { type: Number, default: 0 },
    appointementDate: { type: String },
    isPaid: { type: Boolean, default: false },
    paymentId: { type: mongoose.Schema.Types.ObjectId, ref: "Payment" },
  },
  { timestamps: true }
);

const Appointment = mongoose.model("Appointment", appointement);

export default Appointment;
