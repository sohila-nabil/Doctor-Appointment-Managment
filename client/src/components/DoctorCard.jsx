import React from "react";

const DoctorCard = ({ image, name, speciality, available }) => {
  return (
    <div className="border-[1px] border-slate-300 rounded-md overflow-hidden">
      <div className="w-[210px] bg-[#EAEFFF]">
        <img src={image.url} alt="doctor" className="w-full" />
      </div>
      <div className="p-2">
        <p className="flex items-center gap-2 text-green-700 text-[15px]">
          <div className="bg-green-700 w-2 h-2 rounded-full"></div>
          {available ? "available" : "not available"}
        </p>
        <h3 className="text-[#1F2937] font-medium text-xl">{name}</h3>
        <span className="text-[#4B5563] text-[15px]">{speciality}</span>
      </div>
    </div>
  );
};

export default DoctorCard;
