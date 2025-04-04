import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema({
  orderId: { type: String, required: true },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true,
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Appointment",
    required: true,
  },
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  status: {
    type: String,
    enum: ["COMPLETED", "PENDING", "FAILED"],
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

 const Payment = mongoose.model("Payment", PaymentSchema);
export default Payment


// import mongoose from "mongoose";

// const paymentSchema = new mongoose.Schema({
//   appointmentId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Appointment",
//     required: true,
//   },
//   paypalOrderId: {
//     type: String,
//     required: true,
//   },
//   payerId: {
//     type: String,
//     required: true,
//   },
//   amount: {
//     type: Number,
//     required: true,
//   },
//   currency: {
//     type: String,
//     required: true,
//     default: "USD",
//   },
//   status: {
//     type: String,
//     required: true,
//   },
//   paymentDetails: {
//     type: Object,
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// const Payment = mongoose.model("Payment", paymentSchema);

// export default Payment;