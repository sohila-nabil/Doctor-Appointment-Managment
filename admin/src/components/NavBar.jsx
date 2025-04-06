import React, { memo, useContext } from "react";
import { assets } from "../assets/assets";
import { AdminContext } from "../context/AdminContext";
import { DoctorContext } from "../context/DoctorContext";
import { useNavigate } from "react-router-dom";
const NavBar = () => {
  const navigate = useNavigate();
  const { AdminTonken, setAdminToken } = useContext(AdminContext);
  const { DoctorTonken, setDoctorToken } = useContext( DoctorContext);
  const handleLogout = () => {
    localStorage.removeItem("token") || localStorage.removeItem("doctoken");
    setAdminToken("");
    setDoctorToken("");
    navigate("/");
  };
  return (
    <div className="flex justify-between items-center px-4 sm:px-10  py-3 border-b bg-white">
      <div className="flex items-center gap-2 text-xs">
        <img
          className="w-36 sm:w-40 cursor-pointer"
          src={assets.admin_logo}
          alt="admin_logo"
        />
        <p className="border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-600">
          {AdminTonken ? "Admin" : "Doctor"}
        </p>
      </div>
      <button
        onClick={handleLogout}
        className="bg-primary text-white text-sm px-10 py-2 rounded-full"
      >
        Logout
      </button>
    </div>
  );
};

export default memo(NavBar);

// export default NavBar;