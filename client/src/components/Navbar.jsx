// import React, { useContext, useState } from "react";
// import { assets } from "./../assets/assets";
// import { NavLink, useNavigate } from "react-router-dom";
// import { FaBars, FaTimes } from "react-icons/fa";
// import { projectContext } from "../context/Context";

// const Navbar = () => {
//   const { token, setToken } = useContext(projectContext);
//   const [show, setShow] = useState(false);
//   const [showMenu, setShowMenu] = useState(false);

//   const handleShow = () => {
//     setShow(!show);
//   };

//   const handleShowMenu = () => {
//     setShowMenu(!showMenu);
//   };

//   const navigate = useNavigate();

//   return (
//     <header className=" py-4 mb-5 flex items-center justify-between border-b border-gray-400 relative px-4">
//       {/* Logo */}
//       <img
//         onClick={() => navigate("/")}
//         src={assets.logo}
//         alt="logo"
//         className="w-44 cursor-pointer"
//       />

//       {/* Mobile Menu Button */}
//       <button className="md:hidden text-2xl ml-auto" onClick={handleShow}>
//         {show ? <FaTimes /> : <FaBars />}
//       </button>

//       {/* Navigation Menu */}
//       <div
//         className={`absolute md:static top-16 md:top-0 left-0 w-full md:w-auto bg-gray-200 md:bg-transparent p-5 md:p-0 transition-all duration-300 ${
//           show ? "block" : "hidden md:flex"
//         }`}
//       >
//         <ul className="md:flex items-center gap-5 font-medium">
//           <NavLink to={"/"} className="block md:inline py-2">
//             Home
//             <hr
//               className={
//                 show
//                   ? "border-none outline-none h-0.5 bg-[#5f6FFF] w-10 hidden"
//                   : "border-none outline-none h-0.5 bg-[#5f6FFF] w-3/5 m-auto hidden"
//               }
//             />
//           </NavLink>
//           <NavLink to={"/doctors"} className="block md:inline py-2">
//             All Doctors
//             <hr
//               className={
//                 show
//                   ? "border-none outline-none h-0.5 bg-[#5f6FFF] w-10 hidden text-center"
//                   : "border-none outline-none h-0.5 bg-[#5f6FFF] w-3/5 m-auto hidden text-center"
//               }
//             />
//           </NavLink>
//           <NavLink to={"/about"} className="block md:inline py-2">
//             About
//             <hr
//               className={
//                 show
//                   ? "border-none outline-none h-0.5 bg-[#5f6FFF] w-10 hidden"
//                   : "border-none outline-none h-0.5 bg-[#5f6FFF] w-3/5 m-auto hidden"
//               }
//             />
//           </NavLink>
//           <NavLink to={"/contact"} className="block md:inline py-2">
//             Contact
//             <hr
//               className={
//                 show
//                   ? "border-none outline-none h-0.5 bg-[#5f6FFF] w-10 hidden"
//                   : "border-none outline-none h-0.5 bg-[#5f6FFF] w-3/5 m-auto hidden"
//               }
//             />
//           </NavLink>
//         </ul>
//       </div>

//       {token ? (
//         <div className="flex items-center gap-3 relative group cursor-pointer ml-1">
//           <img
//             className="w-8 rounded-full"
//             src={assets.profile_pic}
//             alt="profile_pic"
//           />
//           <img className="w-3" src={assets.dropdown_icon} alt="dropdown_icon" />
//           <div className=" absolute top-0 right-0 text-gray-600 hidden group-hover:block	font-medium text-base pt-14 z-20">
//             <div className="bg-stone-200 flex flex-col gap-4 p-4 rounded min-w-48">
//               <p
//                 onClick={() => navigate("/profile")}
//                 className="hover:text-black cursor-pointer"
//               >
//                 My Profile
//               </p>
//               <p
//                 onClick={() => navigate("/my-appointement")}
//                 className="hover:text-black cursor-pointer"
//               >
//                 My Appointments
//               </p>
//               <p
//                 onClick={() => {
//                   setToken(false), navigate("/login");
//                 }}
//                 className="hover:text-black cursor-pointer"
//               >
//                 Logout
//               </p>
//             </div>
//           </div>
//         </div>
//       ) : (
//         <button className=" hidden md:block bg-[#5f6FFF] px-8 py-3 rounded-full text-white font-light">
//           Create an account
//         </button>
//       )}
//     </header>
//   );
// };

// export default Navbar;

"use client";

import { useContext, useState, useEffect, useRef } from "react";
import { assets } from "./../assets/assets";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  FaBars,
  FaTimes,
  FaUser,
  FaCalendarAlt,
  FaSignOutAlt,
} from "react-icons/fa";
import { projectContext } from "../context/Context";

const Navbar = () => {
  const { token, setToken } = useContext(projectContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleProfileMenu = () => {
    setProfileMenuOpen(!profileMenuOpen);
  };

  const handleLogout = () => {
    setToken(false);
    navigate("/login");
    setProfileMenuOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="py-4 mb-5 border-b border-gray-200 bg-white fixed top-0 left-0 right-0  shadow-sm z-50">
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <img
          onClick={() => navigate("/")}
          src={assets.logo || "/placeholder.svg"}
          alt="logo"
          className="w-36 md:w-44 cursor-pointer"
        />

        {/* Desktop Navigation */}
        <nav className="hidden md:block">
          <ul className="flex items-center gap-8 font-medium">
            <li>
              <NavLink
                to="/"
                className={`relative py-2 px-1 transition-colors ${
                  isActive("/")
                    ? "text-[#5f6FFF]"
                    : "text-gray-700 hover:text-[#5f6FFF]"
                }`}
              >
                Home
                {isActive("/") && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#5f6FFF] rounded-full"></span>
                )}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/doctors"
                className={`relative py-2 px-1 transition-colors ${
                  isActive("/doctors")
                    ? "text-[#5f6FFF]"
                    : "text-gray-700 hover:text-[#5f6FFF]"
                }`}
              >
                All Doctors
                {isActive("/doctors") && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#5f6FFF] rounded-full"></span>
                )}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/about"
                className={`relative py-2 px-1 transition-colors ${
                  isActive("/about")
                    ? "text-[#5f6FFF]"
                    : "text-gray-700 hover:text-[#5f6FFF]"
                }`}
              >
                About
                {isActive("/about") && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#5f6FFF] rounded-full"></span>
                )}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/contact"
                className={`relative py-2 px-1 transition-colors ${
                  isActive("/contact")
                    ? "text-[#5f6FFF]"
                    : "text-gray-700 hover:text-[#5f6FFF]"
                }`}
              >
                Contact
                {isActive("/contact") && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#5f6FFF] rounded-full"></span>
                )}
              </NavLink>
            </li>
          </ul>
        </nav>

        {/* Right Side - Auth/Profile */}
        <div className="flex items-center gap-4">
          {token ? (
            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={toggleProfileMenu}
                className="flex items-center gap-2 focus:outline-none"
                aria-expanded={profileMenuOpen}
                aria-haspopup="true"
              >
                <img
                  className="w-8 h-8 rounded-full object-cover border-2 border-[#5f6FFF]"
                  src={assets.profile_pic || "/placeholder.svg"}
                  alt="Profile"
                />
                <img
                  className={`w-3 transition-transform duration-200 ${
                    profileMenuOpen ? "rotate-180" : ""
                  }`}
                  src={assets.dropdown_icon || "/placeholder.svg"}
                  alt=""
                />
              </button>

              {/* Profile Dropdown Menu */}
              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-100">
                  <button
                    onClick={() => {
                      navigate("/profile");
                      setProfileMenuOpen(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <FaUser className="mr-2 text-[#5f6FFF]" />
                    My Profile
                  </button>
                  <button
                    onClick={() => {
                      navigate("/my-appointement");
                      setProfileMenuOpen(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <FaCalendarAlt className="mr-2 text-[#5f6FFF]" />
                    My Appointments
                  </button>
                  <hr className="my-1 border-gray-200" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    <FaSignOutAlt className="mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="hidden md:block bg-[#5f6FFF] px-6 py-2 rounded-full text-white font-medium hover:bg-[#4a5aee] transition-colors"
            >
              Create an account
            </button>
          )}

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-2xl text-gray-700 focus:outline-none"
            onClick={toggleMobileMenu}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden transition-opacity duration-300 ${
          mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={toggleMobileMenu}
      ></div>

      <div
        className={`fixed top-0 right-0 h-full w-3/4 max-w-xs bg-white z-50 transform transition-transform duration-300 ease-in-out shadow-xl md:hidden ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <img
            src={assets.logo || "/placeholder.svg"}
            alt="logo"
            className="w-32"
          />
          <button
            className="text-2xl text-gray-700 focus:outline-none"
            onClick={toggleMobileMenu}
          >
            <FaTimes />
          </button>
        </div>

        <nav className="p-4">
          <ul className="space-y-4">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `block py-2 px-4 rounded-lg ${
                    isActive
                      ? "bg-[#5f6FFF]/10 text-[#5f6FFF] font-medium"
                      : "text-gray-700"
                  }`
                }
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/doctors"
                className={({ isActive }) =>
                  `block py-2 px-4 rounded-lg ${
                    isActive
                      ? "bg-[#5f6FFF]/10 text-[#5f6FFF] font-medium"
                      : "text-gray-700"
                  }`
                }
              >
                All Doctors
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  `block py-2 px-4 rounded-lg ${
                    isActive
                      ? "bg-[#5f6FFF]/10 text-[#5f6FFF] font-medium"
                      : "text-gray-700"
                  }`
                }
              >
                About
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  `block py-2 px-4 rounded-lg ${
                    isActive
                      ? "bg-[#5f6FFF]/10 text-[#5f6FFF] font-medium"
                      : "text-gray-700"
                  }`
                }
              >
                Contact
              </NavLink>
            </li>
          </ul>

          {token ? (
            <div className="mt-6 border-t border-gray-200 pt-4">
              <div className="flex items-center gap-3 px-4 py-2">
                <img
                  className="w-10 h-10 rounded-full object-cover border-2 border-[#5f6FFF]"
                  src={assets.profile_pic || "/placeholder.svg"}
                  alt="Profile"
                />
                <div>
                  <p className="font-medium">Your Profile</p>
                  <p className="text-sm text-gray-500">Manage your account</p>
                </div>
              </div>

              <ul className="mt-4 space-y-2">
                <li>
                  <button
                    onClick={() => {
                      navigate("/profile");
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                    <FaUser className="mr-3 text-[#5f6FFF]" />
                    My Profile
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      navigate("/my-appointement");
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                    <FaCalendarAlt className="mr-3 text-[#5f6FFF]" />
                    My Appointments
                  </button>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <FaSignOutAlt className="mr-3" />
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <div className="mt-6 px-4">
              <button
                onClick={() => {
                  navigate("/login");
                  setMobileMenuOpen(false);
                }}
                className="w-full bg-[#5f6FFF] py-3 rounded-lg text-white font-medium hover:bg-[#4a5aee] transition-colors"
              >
                Create an account
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
