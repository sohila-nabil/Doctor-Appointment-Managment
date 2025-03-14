import React, { useContext, useEffect, useState } from "react";
import Title from "./Title";
import { projectContext } from "../context/Context";
import DoctorCard from "./DoctorCard";
import { useNavigate } from "react-router-dom";

const TopDoctors = () => {
  const { doctors } = useContext(projectContext);
  const [availableDoctors, setAvailableDoctors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const filteredDoctors = doctors?.filter((item) => item);
    setAvailableDoctors(filteredDoctors);
  }, [doctors]);

  return (
    <div className="mt-20 flex flex-col gap-4">
      <div className="mb-10">
        <Title
          title={"Top Doctors to Book"}
          text={"Simply browse through our extensive list of trusted doctors."}
        />
      </div>
      <div className="flex items-center gap-4 justify-evenly flex-wrap mx-auto mt-4 w-fit">
        {availableDoctors?.slice(0, 10)?.map((item, index) => (
          <div
            onClick={() => navigate(`/appointement/${item._id}`)}
            key={item._id}
            className="  hover:translate-y-[-10px] cursor-pointer transition-all duration-500"
          >
            <DoctorCard
              image={item.image}
              name={item.name}
              speciality={item.speciality}
              available={item.available}
              className="group-hover:translate-y-[-10px] transition-all duration-500"
            />
          </div>
        ))}
      </div>
      <button
        className="bg-[#EAEFFF] rounded-[50px] w-[214px] h-[60px] mx-auto mt-6"
        onClick={() => {
          navigate("/doctors");
          scrollTo(0, 0);
        }}
      >
        More
      </button>
    </div>
  );
};

export default TopDoctors;
