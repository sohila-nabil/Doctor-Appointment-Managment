import React from "react";

const AppointmentCard = ({ img, dr_name, date }) => {
  return (
    <li>
      <div className="flex items-center gap-4">
        <img className=" w-16 h-16 rounded-full" src={img} alt="profile_pic" />
        <div>
          <h2 className="text-lg font-semibold">{dr_name}</h2>
          <p className="text-gray-500">Booking on {date}</p>
        </div>
      </div>
    </li>
  );
};

export default AppointmentCard;
