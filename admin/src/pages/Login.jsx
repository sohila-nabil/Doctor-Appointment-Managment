import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import { AdminContext } from "../context/AdminContext";
import { toast, Zoom } from "react-toastify";
const Login = () => {
  const {  AdminTonken,setAdminToken ,backendUrl } = useContext(AdminContext);
  const [state, setState] = useState("Admin");
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });
  const handleOnSubmit = async (e) => {
    e.preventDefault();
    try {
      if (state === "Admin") {
        const res = await axios.post(`${backendUrl}/api/admin/login`, userData);
        if (res.data.success) {
          setAdminToken(res.data.token);
          localStorage.setItem("token", res.data.token);
          // window.location.href = "/dashboard";
        } else {
          toast.error(res.data.message);
        }
      } else {
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response.data.message);
    }
    console.log(userData);
  };

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };
  return (
    <form onSubmit={handleOnSubmit} className="min-h-[80vh] flex items-center">
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg">
        <p className="text-2xl font-semibold m-auto">
          <span className="text-primary"> {state} </span>
          Login
        </p>
        <div className="w-full">
          <p>Email</p>
          <input
            className="border border-[#DADADA] rounded w-full p-2 mt-1"
            type="email"
            placeholder="Enter your Email"
            name="email"
            onChange={handleChange}
          />
        </div>

        <div className="w-full">
          <p>Password</p>
          <input
            className="border border-[#DADADA] rounded w-full p-2 mt-1"
            type="password"
            placeholder="********"
            name="password"
            onChange={handleChange}
          />
        </div>
        <button className="bg-primary text-white w-full py-2 rounded-md text-base">
          Login
        </button>
        {state === "Admin" ? (
          <p>
            Doctor Login?
            <span
              className="cursor-pointer underline text-primary"
              onClick={() => setState("Doctor")}
            >
              Click here
            </span>
          </p>
        ) : (
          <p>
            Admin Login?
            <span
              className="cursor-pointer underline text-primary"
              onClick={() => setState("Admin")}
            >
              Click here
            </span>
          </p>
        )}
      </div>
    </form>
  );
};

export default Login;
