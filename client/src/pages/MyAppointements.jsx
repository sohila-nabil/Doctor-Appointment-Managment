import React, { useContext, useEffect, useState } from "react";
import { projectContext } from "./../context/Context";
import { Spinner } from "../components/Spinner";
import axios from "axios";
import { toast } from "react-toastify";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const MyAppointments = () => {
  const { backendUrl, token } = useContext(projectContext);
  const [userAppointments, setUserAppointments] = useState([]);
  const [loadingUserAppointments, setLoadingUserAppointments] = useState(true);

  const getUserAppointments = async () => {
    setLoadingUserAppointments(true);
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/user/getuser-appointments`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data.success) {
        setUserAppointments(data.appointments);
      } else {
        setUserAppointments([]);
      }
    } catch (error) {
      console.log("Error fetching user appointments data:", error);
    } finally {
      setLoadingUserAppointments(false);
    }
  };

  useEffect(() => {
    if (token) getUserAppointments();
  }, [token]);

  const createOrder = async (appointment) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/pay/create-order`, {
        appointmentId: appointment._id,
      });
      if (data.success);
      {
        const orderId = data.orderId;
        return orderId;
      }
    } catch (error) {
      console.log("Error creating order:", error);
      toast.error("Error creating order. Please try again.");
    }
  };

  const captureOrder = async (data) => {
    console.log("Capture order data:", data);

    try {
      const response = await axios.post(`${backendUrl}/api/pay/capture-order`, {
        orderId: data.orderID,
      });
      console.log("Capture order response:", response.data);
      if (response.data.success) {
        toast.success("Payment successful! Your appointment is confirmed.");
        window.location.href = "/pay-complete";
      }
    } catch (error) {
      console.log("Error capturing order:", error);
    }
  };

  if (loadingUserAppointments) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <PayPalScriptProvider
      options={{
        clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID,
        currency: "USD",
        intent: "capture",
      }}
    >
      <p className="pb-3 mt-28 font-medium text-zinc-700 border-b">
        My appointments
      </p>
      <div className="py-6">
        {userAppointments.length > 0 ? (
          userAppointments.reverse().map((item, index) => (
            <div
              className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b"
              key={index}
            >
              <div>
                <img
                  className="w-32 bg-indigo-50"
                  src={item.doctorId.image.url}
                  alt="image"
                />
              </div>
              <div className="flex-1 text-zinc-600 text-sm">
                <p className="font-semibold text-neutral-800">
                  {item.doctorId.name}
                </p>
                <p>{item.doctorId.speciality}</p>
                <p className="text-zinc-700 font-medium mt-1">Address: </p>
                <p className="text-xs">{item.doctorId.address.line1}</p>
                <p className="text-xs">{item.doctorId.address.line2}</p>
                <p className="text-xs mt-1">
                  <span className="text-sm text-neutral-700 font-medium">
                    Date & Time
                  </span>
                  &nbsp;
                  {item.date} | {item.time}
                </p>
              </div>
              <div className="flex flex-col justify-end gap-2">
                {!item.isCancelled && !item.isPaid && (
                  <PayPalButtons
                    createOrder={() => createOrder(item)}
                    onApprove={captureOrder}
                    style={{
                      layout: "horizontal",
                      color: "blue",
                      shape: "pill",
                      label: "pay",
                      tagline: false,
                    }}
                  />
                )}
                {item.isPaid && (
                  <button className="sm:min-w-48 py-2 border border-green-500 rounded text-center text-sm text-green-500 cursor-not-allowed">
                    Appointment Paid
                  </button>
                )}
                {!item.isCancelled && !item.isPaid && (
                  <button className="text-sm text-slate-500 text-center sm:min-w-48 py-2 border rounded  hover:bg-red-600 hover:text-white transition-all duration-300 ">
                    Cancel Appointment
                  </button>
                )}
                {item.isCancelled && (
                  <button className="sm:min-w-48 py-2 border border-red-500 rounded text-center text-sm text-red-500 cursor-not-allowed">
                    Appointment Cancelled
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div>No appointments found</div>
        )}
      </div>
    </PayPalScriptProvider>
  );
};

export default MyAppointments;
