import React, { useContext } from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import { ToastContainer, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AdminContext } from "./context/AdminContext";
import { DoctorContext } from "./context/DoctorContext";

import NavBar from "./components/NavBar";
import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Admin/Dashboard";
import AllDoctors from "./pages/Admin/AllDoctors";
import AllApointments from "./pages/Admin/AllApointments";
import AddDoctor from "./pages/Admin/AddDoctor";
import AppointmentDetails from "./pages/Admin/AppointmentDetails";
import DoctorDetails from "./pages/DoctorDetails";

import DoctorDashboard from "./pages/Doctor/DoctorDashboard";
import DoctorApointments from './pages/Doctor/DoctorApointments';
const App = () => {
  const { AdminTonken } = useContext(AdminContext);
  const { doctorToken } = useContext(DoctorContext);

  return (
    <div className="bg-[#F8F9FD]">
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Zoom}
      />

      {AdminTonken ? (
        <>
          <NavBar />
          <div className="flex items-start gap-8">
            <Sidebar />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/admin-dashbord" element={<Dashboard />} />
              <Route path="/doctors" element={<AllDoctors />} />
              <Route path="/apointments" element={<AllApointments />} />
              <Route path="/add-doctor" element={<AddDoctor />} />
              <Route
                path="/appointments/:id"
                element={<AppointmentDetails />}
              />
              <Route path="/doctors/:id" element={<DoctorDetails />} />
            </Routes>
          </div>
        </>
      ) : doctorToken ? (
        <>
          <NavBar />
          <div className="flex items-start gap-8">
            <Sidebar />
            <Routes>
              <Route path="/" element={<DoctorDashboard />} />
              <Route
                path="/doctor-apointments"
                element={<DoctorApointments />}
              />
              <Route
                path="/appointments/:id"
                element={<AppointmentDetails />}
              />
              <Route path="/doctors/:id" element={<DoctorDetails />} />
            </Routes>
          </div>
        </>
      ) : (
        <Routes>
          <Route path="/" element={<Login />} />
        </Routes>
      )}
    </div>
  );
};

export default App;
