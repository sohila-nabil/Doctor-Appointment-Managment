import React, { memo, useContext } from "react";
import { AdminContext } from "./../context/AdminContext";
import { NavLink } from "react-router-dom";
import { assets } from "./../assets/assets";

const Sidebar = () => {
  const { AdminTonken } = useContext(AdminContext);
  return (
    <div className="min-h-screen bg-white border-r">
      {AdminTonken && (
        <ul className="text-[#515151] mt-5">
          <NavLink
            to="/admin-dashbord"
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
                isActive ? "bg-[#F2F3FF] border-r-4 border-primary" : ""
              }`
            }
          >
            <img src={assets.home_icon} alt="home_icon" />
            <p>Dashboard</p>
          </NavLink>

          <NavLink
            to="/apointments"
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
                isActive ? "bg-[#F2F3FF] border-r-4 border-primary" : ""
              }`
            }
          >
            <img src={assets.appointment_icon} alt="appointments_icon" />
            <p>Appointments</p>
          </NavLink>

          <NavLink
            to="/add-doctor"
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
                isActive ? "bg-[#F2F3FF] border-r-4 border-primary" : ""
              }`
            }
          >
            <img src={assets.add_icon} alt="add_icon" />
            <p>Add Doctor</p>
          </NavLink>

          <NavLink
            to="/doctors"
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
                isActive ? "bg-[#F2F3FF] border-r-4 border-primary" : ""
              }`
            }
          >
            <img src={assets.people_icon} alt="list_icon" />
            <p>Doctors</p>
          </NavLink>
        </ul>
      )}
    </div>
  );
};

export default memo(Sidebar);
