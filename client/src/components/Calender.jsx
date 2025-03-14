import React, { useState } from "react";
import { MdKeyboardArrowRight, MdKeyboardArrowLeft } from "react-icons/md";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();
  const lastDateOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();
  const prevLastDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    0
  ).getDate();

  const handleNextMonth = () => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
    setSelectedDate(null);
    setSelectedTime("");
  };

  const handlePrevMonth = () => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
    setSelectedDate(null);
    setSelectedTime("");
  };

  const handleDateClick = (day) => {
    const selectedFullDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    setSelectedDate(selectedFullDate);
    setSelectedTime("");
  };

  const formatTime = (time) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12; // Convert 24-hour to 12-hour format
    return `${formattedHours}:${String(minutes).padStart(2, "0")} ${period}`;
  };

  const handleBooking = () => {
    if (!selectedTime) {
      alert("Please select a time for your appointment.");
      return;
    }
    alert(
      `Booking confirmed for ${selectedDate.toDateString()} at ${formatTime(
        selectedTime
      )}`
    );
  };

  const daysArray = [];
  for (let i = firstDayOfMonth; i > 0; i--) {
    daysArray.push({ day: prevLastDate - i + 1, isCurrentMonth: false });
  }
  for (let i = 1; i <= lastDateOfMonth; i++) {
    daysArray.push({ day: i, isCurrentMonth: true });
  }

  return (
    <div className="mx-auto mt-10 bg-white shadow-lg rounded-lg relative ">
      <div className="bg-[#5F6FFF] flex items-center justify-between py-3 px-4 text-white text-lg rounded-t-lg">
        <MdKeyboardArrowLeft
          onClick={handlePrevMonth}
          className="cursor-pointer hover:bg-gray-300 rounded-full p-1 text-2xl"
        />
        {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        <MdKeyboardArrowRight
          onClick={handleNextMonth}
          className="cursor-pointer hover:bg-gray-300 rounded-full p-1 text-2xl"
        />
      </div>

      <div className="grid grid-cols-7 text-center font-medium mt-2 text-gray-700">
        {dayNames.map((day, index) => (
          <div key={index} className="py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {daysArray.map((item, index) => (
          <div
            key={index}
            onClick={() => item.isCurrentMonth && handleDateClick(item.day)}
            className={`py-3 rounded-lg text-lg cursor-pointer transition-all 
              ${
                item.isCurrentMonth
                  ? selectedDate?.getDate() === item.day &&
                    selectedDate?.getMonth() === currentDate.getMonth()
                    ? "bg-blue-500 text-white"
                    : "text-black hover:bg-gray-200"
                  : "text-gray-400"
              }`}
          >
            {item.day}
          </div>
        ))}
      </div>

      {selectedDate && (
        <div className=" absolute mt-4">
          <h3 className="text-lg font-semibold">Select Time</h3>
          <input
            type="time"
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-1 mt-2 w-full"
            required
          />

          <button
            onClick={handleBooking}
            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-all mt-3"
          >
            Book Appointment on {selectedDate.toDateString()}
            {selectedTime && `at ${formatTime(selectedTime)}`}
          </button>
        </div>
      )}
    </div>
  );
};

export default Calendar;
