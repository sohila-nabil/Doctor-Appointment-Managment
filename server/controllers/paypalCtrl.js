import axios from "axios";
import Payment from "../models/paymentModel.js";
import Doctor from "../models/doctorModel.js";
import Appointment from "../models/appointments.js";
import errorHandler from "../utils/errorHandller.js";
import sendEmail from "../utils/sendEmail.js";

// Generate PayPal access token
const generateAccessToken = async () => {
  try {
    const response = await axios({
      method: "POST",
      url: `${process.env.PAYPAL_BASE_URL}/v1/oauth2/token`,
      data: "grant_type=client_credentials",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      auth: {
        username: process.env.PAYPAL_CLIENT_ID,
        password: process.env.PAYPAL_CLIENT_SECRET,
      },
    });

    return response.data.access_token;
  } catch (error) {
    console.error(
      "Error generating PayPal access token:",
      error.response?.data || error.message
    );
    throw new Error("Failed to generate PayPal access token");
  }
};

// Create Payment Order - Redirect to PayPal Checkout Page
const createOrder = async (req, res, next) => {
  try {
    const { appointmentId } = req.body;
    // Generate PayPal access token
    const accessToken = await generateAccessToken();
    const appointment = await Appointment.findById(appointmentId)
      .populate("doctorId")
      .populate("userId");
    const doctorId = appointment.doctorId;
    const patientId = appointment.userId;
    const paymentAmount = appointment.doctorId.fees;

    // Create PayPal order
    const response = await axios({
      method: "POST",
      url: `${process.env.PAYPAL_BASE_URL}/v2/checkout/orders`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      // Add this inside data: {} in axios POST for PayPal order
      data: {
        intent: "CAPTURE",
        purchase_units: [
          {
            items: [
              {
                name: "Doctor Consultation",
                description: `Consultation with Dr. ${appointment.doctorId.name} (${appointment.doctorId.specialization}) on ${appointment.date}`,
                quantity: "1",
                unit_amount: {
                  currency_code: "USD",
                  value: paymentAmount,
                },
              },
            ],
            amount: {
              currency_code: "USD",
              value: paymentAmount,
              breakdown: {
                item_total: {
                  currency_code: "USD",
                  value: paymentAmount,
                },
              },
            },
          },
        ],
        application_context: {
          brand_name: "MediApp",
          landing_page: "NO_PREFERENCE",
          user_action: "PAY_NOW",
          return_url: `${process.env.FRONTEND_URL}/pay-complete`,
          cancel_url: `${process.env.FRONTEND_URL}/pay-canceled`,
        },
      },
    });
    console.log("PayPal Order Response:", response.data);

    // Save payment record to database
    const payment = new Payment({
      orderId: response.data.id,
      doctorId: doctorId,
      appointmentId: appointment._id,
      patientId,
      amount: paymentAmount,
      currency: "USD",
      status: "PENDING",
    });
    await payment.save();
    // // Return order ID and approval URL to frontend
    console.log("PayPal Order ID:", response.data.id);

    res.json({
      success: true,
      orderId: response.data.id,
      // approvalUrl: approvalLink,
    });
  } catch (error) {
    console.error(
      "Error creating PayPal order:",
      error.response?.data || error.message
    );
    next(errorHandler(500, error.message || "Failed to create payment order"));
  }
};

// Capture Payment - After PayPal Approval
const captureOrder = async (req, res, next) => {
  try {
    const accessToken = await generateAccessToken();
    const { orderId } = req.body;

    if (!orderId) {
      return next(errorHandler(400, "Order ID is required"));
    }
    // Capture the payment
    const response = await axios.post(
      `${process.env.PAYPAL_BASE_URL}/v2/checkout/orders/${orderId}/capture`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    console.log(response.data);

    // Find payment record and update the status
    const payment = await Payment.findOne({ orderId })
      .populate("doctorId")
      .populate("patientId")
      .populate("appointmentId");
    if (payment) {
      payment.status = "COMPLETED";
      payment.paymentDetails = response.data; // Store PayPal response for details
      await payment.save();

      // Update appointment payment status
      if (payment.appointmentId) {
        await Appointment.findByIdAndUpdate(payment.appointmentId, {
          isPaid: true,
          paymentId: payment._id,
        });
      }
    }

    await sendEmail({
      to: payment.doctorId.email,
      subject: "New Appointment Booked",
      text: `Dear Dr. ${payment.doctorId.name},\n\nA new appointment has been booked for ${payment.appointmentId.date} at ${payment.appointmentId.time}.`,
    });

    await sendEmail({
      to: payment.patientId.email,
      subject: "Appointment Confirmed",
      text: `Hello ${payment.patientId.name},\n\nYour appointment with Dr. ${payment.doctorId.name} has been confirmed for ${payment.appointmentId.date} at ${payment.appointmentId.time}.`,
    });
    res.json({
      success: true,
      message: "Payment captured successfully!",
    });
  } catch (error) {
    console.error(
      "Error capturing order:",
      error.response?.data || error.message
    );
    next(errorHandler(500, error.message || "Payment capture failed"));
  }
};

export { createOrder, captureOrder };
