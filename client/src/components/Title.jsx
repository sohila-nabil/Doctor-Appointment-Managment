import React from "react";

const Title = ({ title, text }) => {
  return (
    <div className="mx-auto  text-center  md:w-[573px] flex flex-col items-center">
      <h2 className="font-medium text-[30px] sm:text-[40px] text-[#1F2937]">{title}</h2>
      <p className="font-normal text-[18px] text-[#4B5563] mt-2">{text}</p>
    </div>
  );
};

export default Title;
