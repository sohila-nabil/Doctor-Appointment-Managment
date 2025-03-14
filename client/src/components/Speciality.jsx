import React, { useContext, useEffect, useRef } from "react";
import Title from "./Title";
import DoctorCircle from "./DoctorCircle";
import { projectContext } from "../context/Context";

const Speciality = () => {
  const { specialityData } = useContext(projectContext);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
    }
  }, [specialityData.length]);

  return (
    <div className="mt-20" id="speciality">
      <div className="mb-10">
        <Title
          title={"Find by Speciality"}
          text={
            "Simply browse through our extensive list of trusted doctors, schedule your appointment hassle-free."
          }
        />
      </div>

      {/* Scrollable Container */}
      <div
        ref={scrollRef}
        className="flex items-center w-[300px] sm:w-[950px] mx-auto overflow-x-auto  space-x-4 px-4 py-2 scroll-smooth"
        style={{ scrollSnapType: "x mandatory", whiteSpace: "nowrap" }}
      >
        {specialityData.map((item, index) => (
          <div key={index} className="scroll-snap-align-start">
            <DoctorCircle image={item.image} speciality={item.speciality} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Speciality;
