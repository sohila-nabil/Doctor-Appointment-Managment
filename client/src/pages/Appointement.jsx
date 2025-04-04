import React, { useContext, useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { useParams, useNavigate } from "react-router-dom";
import { projectContext } from "../context/Context";
import Calender from "../components/Calender";
import Title from "../components/Title";
import DoctorCard from "../components/DoctorCard";

const Appointement = () => {
  const { docId } = useParams();
  const navigate = useNavigate();
  const { doctors } = useContext(projectContext);

  const [doctor, setDoctor] = useState(null);
  const [relatedDoctor, setRelatedDoctor] = useState([]);
  const [currentDay, setCurrentDay] = useState("");

  useEffect(() => {
    if (docId && doctors.length > 0) {
      const foundDoctor = doctors.find((item) => item._id === docId);
      setDoctor(foundDoctor || null);

      if (foundDoctor) {
        const relatedDoctors = doctors?.filter(
          (item) =>
            item?.speciality === foundDoctor?.speciality && item._id !== docId
        );
        setRelatedDoctor(relatedDoctors);
      }
    }

    // Get the current day
    const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
    setCurrentDay(today);
  }, [docId, doctors]);

  if (!doctor) {
    return (
      <p className="text-center text-gray-500">Loading doctor details...</p>
    );
  }



  return (
    <div className="mt-28">
      {/* Doctor Details */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Doctor Image */}
        <div className="bg-[#5F6FFF] rounded-lg">
          <img
            className="w-full sm:max-w-72 "
            src={doctor.image.url}
            alt="doctor"
          />
        </div>

        {/* Doctor Info */}
        <div className="flex-1 border border-gray-300 rounded-lg px-4 py-2 lg:py-10 lg:px-5">
          <div>
            <h3 className="font-medium text-2xl text-[#1F2937] mb-2 lg:mt-[-5px] flex items-center gap-2">
              {doctor.name}
              <img
                className="w-5"
                src={assets.verified_icon}
                alt="verified_icon"
              />
            </h3>
            <div className="text-[#4B5563] text-sm flex gap-3 mb-3">
              <p>
                {doctor.degree} - {doctor.speciality}
              </p>
              <p className="flex items-center justify-center rounded-xl border border-gray-400 px-3 text-xs">
                {doctor.experience}
              </p>
            </div>
          </div>

          {/* About Doctor */}
          <div>
            <p className="font-medium text-[#1F2937] text-[18px] flex items-center gap-2">
              About
              <img src={assets.info_icon} alt="info_icon" />
            </p>
            <p className="text-[#4B5563] text-sm my-3 max-w-[700px]">
              {doctor.about}
            </p>
            <p className="text-[22px] text-[#4B5563]">
              Appointment fee:
              <span className="text-[#1F2937] text-[22px] font-medium">
                ${doctor.fees}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Working Hours */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-3">
          Working Hours
        </h3>
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">Day</th>
              <th className="border border-gray-300 p-2">Time</th>
            </tr>
          </thead>
          <tbody>
            {doctor.workingHours.map((day, index) => (
              <tr key={index}>
                <td
                  className={`border border-gray-300 p-2 ${
                    currentDay === day.day ? "bg-blue-100 border-blue-500" : ""
                  }`}
                >
                  {day.day}
                </td>
                <td className="border border-gray-300 p-2">
                  {day.startTime} - {day.endTime}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 className="mt-10 mb-5 text-xl font-semibold text-gray-800">
        Make an appointment
      </h3>
      {/* Calendar Component */}
      <Calender doctor={doctor} />

      {/* Related Doctors Section */}
      <div className="mt-40">
        <Title
          title={"Related Doctors"}
          text={"Simply browse through our extensive list of trusted doctors."}
        />
        <div className="flex items-center gap-4 justify-evenly flex-wrap mx-auto mt-4 w-fit">
          {relatedDoctor.length > 0 ? (
            relatedDoctor.map((item) => (
              <div
                key={item._id}
                onClick={() => {
                  navigate(`/appointement/${item._id}`), scrollTo(0, 0);
                }}
                className="hover:translate-y-[-10px] cursor-pointer transition-all duration-500"
              >
                <DoctorCard
                  image={item.image}
                  name={item.name}
                  speciality={item.speciality}
                  available={item.available}
                  className="group-hover:translate-y-[-10px] transition-all duration-500"
                />
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">
              No related doctors found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Appointement;
