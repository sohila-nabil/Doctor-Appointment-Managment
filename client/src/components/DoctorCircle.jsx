import React from "react";
import { Link } from "react-router-dom";

const DoctorCircle = ({ speciality, image }) => {
  return (
    <Link
      onClick={() => scrollTo(0, 0)}
      to={`/doctors/${speciality}`}
      className="flex flex-col items-center gap-3 text-center hover:translate-y-[-10px] transition-all duration-500"
    >
      <img className="w-16 sm:w-24" src={image} alt="image" />
      <p className="text-[#4B5563] text-[18px] ">{speciality}</p>
    </Link>
  );
};

export default DoctorCircle;
