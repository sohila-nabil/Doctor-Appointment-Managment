import React, { useContext, useEffect, useState } from "react";
import SpecializationBox from "../components/SpecializationBox";
import { projectContext } from "./../context/Context";
import { useParams, useNavigate } from "react-router-dom";
import DoctorCard from "../components/DoctorCard";

const Doctors = () => {
  const { doctors, specialityData } = useContext(projectContext);
  const [specifiedDoctors, setSpecifiedDoctors] = useState([]);
  const [specialization, setSpecialization] = useState([]);
  const { speciality } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    let specialize;
    if (speciality) {
      let special = doctors.filter((doc) => doc.speciality === speciality);
      specialize = specialityData.map((sp) => sp.speciality);
      setSpecialization(specialize);
      setSpecifiedDoctors(special);
    } else {
      specialize = specialityData.map((sp) => sp.speciality);
      let uniqueSpecialze = [...new Set(specialize)];
      setSpecialization(uniqueSpecialze);
      setSpecifiedDoctors(doctors);
    }
  }, [doctors, specialityData, speciality]);

  const handleSpecializationClick = (selectedSpeciality) => {
    navigate(`/doctors/${selectedSpeciality}`);
  };

  return (
    <div className="mt-28">
      <h3 className="mb-10">Browse through the doctors specialist.</h3>
      <div className="flex flex-col sm:flex-row gap-10">
        {/* Left Side - Specializations List */}
        <div className="flex flex-col gap-5">
          {specialization.map((item, index) => (
            <div
              key={index}
              className={`cursor-pointer p-2 rounded py-2 px-7 text-gray-600 border border-gray-300 ${
                item === speciality && "bg-indigo-100 text-black"
              }`}
              onClick={() => handleSpecializationClick(item)}
            >
              <SpecializationBox text={item} />
            </div>
          ))}
        </div>

        {/* Right Side - Doctors List */}
        <div className="flex sm:items-start gap-4 flex-wrap">
          {specifiedDoctors.map((item) => (
            <div
              key={item._id}
              onClick={() => navigate(`/appointement/${item._id}`)}
              className="mt-0 hover:translate-y-[-10px] cursor-pointer transition-all duration-500"
            >
              <DoctorCard
                image={item.image}
                name={item.name}
                speciality={item.speciality}
                available={item.available}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Doctors;
