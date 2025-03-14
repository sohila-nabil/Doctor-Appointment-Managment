import React from "react";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="flex flex-col items-center gap-4 mt-48 ">
      <div className="flex items-center justify-between gap-16 flex-col lg:flex-row lg:items-start ">
        <div className="flex-1">
          <img src={assets.logo} alt="logo" />
          <p className="lg:w-[620px] text-[#4B5563] text-[18px] leaing-[30px] mt-6">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book.
          </p>
        </div>
        <div className="text-[#4B5563]">
          <h3 className="font-semibold text-[22px] leading-[30px] mb-5">
            COMPANY
          </h3>
          <ul className="flex flex-col items-start gap-3">
            <Link to={"/"}>Home</Link>
            <Link to={"/about"}>About us</Link>
            <Link to={"/contact"}>Contact us</Link>
            <Link to={"/about"}>Privacy Policy</Link>
          </ul>
        </div>
        <div className="text-[#4B5563]">
          <h3 className="font-semibold text-[22px] leading-[30px] mb-5"> 
            GET IN TOUCH
          </h3>
          <div>
            <p>+0129200342</p>
            <p>sohila@example.com</p>
          </div>
        </div>
      </div>
      <div className="border-t-2 w-full p-2 text-[#4B5563]">
        <p className="w-fit mx-auto">CopyRight@</p>
      </div>
    </div>
  );
};

export default Footer;
