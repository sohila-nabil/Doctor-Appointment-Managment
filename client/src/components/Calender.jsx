"use client";

import { useContext, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { projectContext } from "../context/Context";
import { useNavigate } from "react-router-dom";

const Calendar = ({ doctor }) => {
  const { backendUrl, token } = useContext(projectContext);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    const selectedDay = new Date(selectedDate).toLocaleDateString("en-US", {
      weekday: "long",
    });

    const isAvailable = doctor.workingHours.some(
      (day) => day.day === selectedDay
    );

    if (!isAvailable) {
      toast.error(
        "Doctor is not available on this day. Please choose another day."
      );
      setDate("");
      return;
    }
    setDate(selectedDate);
  };

  // Convert time from HH:MM format to minutes for easy comparison
  const timeToMinutes = (timeStr) => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours * 60 + minutes;
  };

  // Format time from 24-hour to 12-hour format for display
  const formatTime = (time) => {
    if (!time) return "";

    const [hour, minute] = time.split(":").map(Number);
    const ampm = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    const formattedMinute = minute.toString().padStart(2, "0");
    return `${formattedHour}:${formattedMinute} ${ampm}`;
  };

  const handleTimeChange = (e) => {
    const selectedTime = e.target.value; // This is in 24-hour format (HH:MM)

    if (!date) {
      toast.error("Please select a date first");
      setTime("");
      return;
    }

    const selectedDay = new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
    });

    const workingDay = doctor.workingHours.find(
      (day) => day.day === selectedDay
    );

    if (workingDay) {
      // Convert all times to minutes for easier comparison
      const startTimeMinutes = timeToMinutes(workingDay.startTime);
      const endTimeMinutes = timeToMinutes(workingDay.endTime);
      const selectedTimeMinutes = timeToMinutes(selectedTime);

      if (
        selectedTimeMinutes < startTimeMinutes ||
        selectedTimeMinutes > endTimeMinutes
      ) {
        toast.error(
          `Doctor is available from ${formatTime(
            workingDay.startTime
          )} to ${formatTime(workingDay.endTime)}`
        );
        setTime("");
        return;
      }

      // If we reach here, the time is valid
      setTime(selectedTime);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!date || !time) {
      toast.error("Please select a valid date and time.");
      return;
    }
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/book-appointment`,
        {
          date,
          time,
          doctorId: doctor._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(data);
      if (data.success) {
        toast.success(data.message);
        navigate("/my-appointement");
        scrollTo(0, 0);
      }
    } catch (error) {
      console.error("Error booking appointment:", error);
      toast.error(error.response.data.message || "Error booking appointment");
      return;
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg  mt-6"
    >
      <h2 className="text-xl font-semibold text-gray-700 mb-4">
        Book an Appointment
      </h2>
      <div className="mb-4">
        <label htmlFor="date" className="block text-gray-600 font-medium">
          Date:
        </label>
        <input
          type="date"
          id="date"
          name="date"
          value={date}
          onChange={handleDateChange}
          className="w-full px-3 py-2 border rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="time" className="block text-gray-600 font-medium">
          Time:
        </label>
        <input
          type="time"
          id="time"
          name="time"
          value={time}
          onChange={handleTimeChange}
          className="w-full px-3 py-2 border rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        {date && time && (
          <p className="mt-2 text-sm text-gray-600">
            Selected time: {formatTime(time)}
          </p>
        )}
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-all"
      >
        {loading ? "Booking..." : "Book Appointment"}
      </button>
    </form>
  );
};

export default Calendar;
