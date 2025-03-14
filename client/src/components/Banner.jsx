import React from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";

const Banner = () => {
  const navigate = useNavigate();
  return (
    <div className="px-[50px] bg-[#5F6FFF] w-full h-[360px] relative flex flex-col-reverse sm:flex-row items-center text-white mt-32 rounded-lg ">
      <div>
        <h1 className="font-semibold text-2xl sm:text-5xl leading-snug mb-3 sm:mb-6">
          Book Appointment <br /> With 100+ Trusted Doctors
        </h1>
        <a
          onClick={() => {
            navigate("/login"), scrollTo(0, 0);
          }}
          href="#speciality"
          className="bg-white hover:scale-105 transition-all duration-300 text-[#5f6FFF] rounded-full py-3 px-10  relative inline-block"
        >
          Create an account
        </a>
      </div>
      <div className="sm:w-[340px] w-52 absolute top-[-35px] sm:top-[-20px] right-20 sm:right-10">
        <img src={assets.appointment_img} alt="header" className="w-full" />
      </div>
    </div>
  );
};

export default Banner;
