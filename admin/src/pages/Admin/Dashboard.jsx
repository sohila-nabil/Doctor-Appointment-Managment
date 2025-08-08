import React, { useEffect, useContext, useState } from "react";
import CountCard from "../../components/CountCard";
import { assets } from "../../assets/assets";
import AppointmentCard from "../../components/AppointmentCard";
import axios from "axios";
import { AdminContext } from "../../context/AdminContext";
const Dashboard = () => {
  const { backendUrl, AdminTonken } = useContext(AdminContext);
  const [appointmentsCount, setAppointmentsCount] = useState(0);
  const [latestAppoinments, setLatestAppoinments] = useState([]);
  const [doctorsCount, setDoctorsCount] = useState(0);
  const [patientsCount, setPatientsCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const getCounts = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/admin/counts`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log(data);
      setAppointmentsCount(data.appointmentCount);
      setDoctorsCount(data.doctorCount);
      setPatientsCount(data.userCount);
    } catch (error) {
      console.log(error);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", options);
  };
  const getLatestAppointments = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/appointment/latest/appointments`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log(data.appointments);
      setLatestAppoinments(data.appointments);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (AdminTonken) {
      getCounts();
      getLatestAppointments();
    }
  }, [AdminTonken]);

  return (
    <div className="flex flex-col gap-4">
      {/* cards */}
      <div className="grid grid-cols-1 md:grid-cols-3  gap-4 p-4">
        <CountCard
          img={assets.doctor_icon}
          text={"Doctors"}
          count={doctorsCount}
        />
        <CountCard
          img={assets.appointments_icon}
          text={"Appointments"}
          count={appointmentsCount}
        />
        <CountCard
          img={assets.patients_icon}
          text={"Patients"}
          count={patientsCount}
        />
      </div>

      {!loading && latestAppoinments?.length === 0 && (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">No appointments found.</p>
        </div>
      )}

      {/* table */}
      <div className="bg-white border rounded-lg p-4">
        {!loading && latestAppoinments?.length > 0 && (
          <div className="flex  items-center gap-2 p-4 border-b">
            <img src={assets.list_icon} alt="list_icon" />
            <h2 className="text-2xl font-bold text-gray-900">
              Latest Appointment
            </h2>
          </div>
        )}
        <ul className="w-full p-4 flex flex-col gap-5">
          {latestAppoinments?.map((appointment) => (
            <AppointmentCard
              key={appointment.id}
              img={appointment.doctorId.image.url}
              date={formatDate(appointment.date)}
              dr_name={appointment.doctorId.name}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
