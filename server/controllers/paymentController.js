import Payment from "../models/paymentModel.js";
import fetch from "node-fetch";
import Appointment from "../models/appointments.js";

// Create a new Payment model to store payment details
const createPaymentOrder = async (req, res) => {
  try {
    const { appointmentId, amount } = req.body;

    // Verify the appointment exists
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res
        .status(404)
        .json({ success: false, message: "Appointment not found" });
    }

    // Create PayPal order
    const response = await fetch(
      `${process.env.PAYPAL_BASE_URL}/v2/checkout/orders`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${Buffer.from(
            `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
          ).toString("base64")}`,
        },
        body: JSON.stringify({
          intent: "CAPTURE",
          purchase_units: [
            {
              amount: {
                currency_code: "USD",
                value: amount.toString(),
              },
              reference_id: appointmentId,
            },
          ],
        }),
      }
    );

    const data = await response.json();
    console.log(data, "data from paypal");

    if (data.error) {
      return res
        .status(400)
        .json({ success: false, message: data.error.message });
    }

    // Return the order ID to the client
    res.json({ success: true, orderId: data.id });
  } catch (error) {
    console.error("Error creating PayPal order:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to create payment order" });
  }
};

const capturePayment = async (req, res) => {
  try {
    const { orderId } = req.body;

    // Capture the payment
    const response = await fetch(
      `${process.env.PAYPAL_BASE_URL}/v2/checkout/orders/${orderId}/capture`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${Buffer.from(
            `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
          ).toString("base64")}`,
        },
      }
    );

    const data = await response.json();

    if (data.error) {
      return res
        .status(400)
        .json({ success: false, message: data.error.message });
    }

    // Get the appointment ID from the reference_id
    const appointmentId = data.purchase_units[0].reference_id;

    // Update appointment payment status
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res
        .status(404)
        .json({ success: false, message: "Appointment not found" });
    }

    // Create payment record
    const payment = new Payment({
      appointmentId,
      paypalOrderId: orderId,
      payerId: data.payer.payer_id,
      amount: data.purchase_units[0].payments.captures[0].amount.value,
      currency:
        data.purchase_units[0].payments.captures[0].amount.currency_code,
      status: data.status,
      paymentDetails: data,
    });

    await payment.save();

    // Update appointment with payment info
    appointment.isPaid = true;
    appointment.paidAt = Date.now();
    appointment.paymentId = payment._id;
    await appointment.save();

    res.json({ success: true, payment });
  } catch (error) {
    console.error("Error capturing PayPal payment:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to capture payment" });
  }
};

export { createPaymentOrder, capturePayment };
