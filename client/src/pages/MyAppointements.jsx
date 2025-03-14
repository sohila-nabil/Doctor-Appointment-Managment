import React, { useContext } from "react";
import { projectContext } from "./../context/Context";

const MyAppointements = () => {
  const { doctors } = useContext(projectContext);
  return (
    <div>
      <p className="pb-3 mt-12 font-medium text-zinc-700 border-b">
        My appointments
      </p>
      <div className="">
        {doctors.slice(0, 3).map((item, index) => (
          <div
            className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b"
            key={index}
          >
            <div>
              <img className="w-32 bg-indigo-50" src={item.image} alt="image" />
            </div>
            <div className="flex-1 text-zinc-600 text-sm">
              <p className="font-semibold text-neutral-800">{item.name}</p>
              <p>{item.speciality}</p>
              <p className="text-zinc-700 font-medium mt-1">Address : </p>
              <p className="text-xs">{item.address.line1}</p>
              <p className="text-xs">{item.address.line2}</p>
              <p className="text-xs mt-1">
                <span className="text-sm text-neutral-700 font-medium">
                  Date & Time
                </span>
                25, July, 2024 | 8:30 PM
              </p>
            </div>
            <div></div>
            <div className="flex flex-col justify-end gap-2">
              <button className="text-sm text-slate-500 text-center sm:min-w-48 py-2 border rounded hover:bg-[#5F6FFF] hover:text-white transition-all duration-300">
                Pay here
              </button>
              <button className="text-sm text-slate-500 text-center sm:min-w-48 py-2 border rounded  hover:bg-red-600 hover:text-white transition-all duration-300">
                Cancel appointment
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyAppointements;
