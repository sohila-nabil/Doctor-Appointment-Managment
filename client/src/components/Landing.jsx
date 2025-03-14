import React from "react";
import { assets } from "../assets/assets";

const Landing = () => {
  return (
    <div className="px-[50px] mt-10 bg-[#5F6FFF] w-full h-[600px] sm:h-[460px] relative overflow-hidden flex items-center text-white ">
      <div className="mt-[-155px] sm:mt-0">
        <h1 className="font-semibold text-2xl sm:text-3xl md:text-5xl leading-snug">
          Book Appointment <br /> With Trusted Doctors
        </h1>
        <div className="flex flex-col-reverse sm:flex-row items-start sm:items-center gap-3 my-2">
          <img
            className="w-20"
            src={assets.group_profiles}
            alt="group_profiles"
          />
          Simply browse through our extensive list of trusted doctors,
          <br />
          schedule your appointment hassle-free.
        </div>
        <a
          href="#speciality"
          className="bg-white hover:scale-105 transition-all duration-300 text-[#5f6FFF] rounded-full py-3 px-10  relative inline-block"
        >
          Book appointment
          <img
            className=" absolute top-[19px] right-[15px]"
            src={assets.arrow_icon}
            alt="arrow_icon"
          />
        </a>
      </div>
      <div className=" sm:w-96 md:w-[520px] absolute bottom-0  sm:top-10 right-10">
        <img src={assets.header_img} alt="header" className="w-full" />
      </div>
    </div>
  );
};

export default Landing;
