import { useContext, useState, useEffect, memo } from "react";
import { AdminContext } from "../../context/AdminContext";
import { Spinner } from "../../components/spinner";
import axios from "axios";

const AllDoctors = () => {
  const {
    doctors,
    loading,
    error,
    fetchDoctors,
    AdminTonken,
    backendUrl,
    changeDoctorAvailability,
  } = useContext(AdminContext);

  useEffect(() => {
    if (AdminTonken) fetchDoctors();
  }, [AdminTonken]);

  if (loading) {
    return (
      <div className="flex items-center justify-center max-w-4xl m-auto min-h-[400px]">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-gray-600 font-medium">Loading doctors...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl m-auto flex items-center justify-center min-h-[400px]">
        <div className="text-center text-red-500">
          <p className="text-xl font-semibold">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl m-5 max-h-[90vh] overflow-y-scroll">
      <h1 className="text-lg font-medium mb-4">All Doctors</h1>
      <div className="w-full flex flex-wrap gap-4 pt-5 gap-y-6">
        {doctors.map((doctor) => (
          <div
            className="border border-indigo-200 rounded-xl max-w-56 overflow-hidden cursor-pointer group"
            key={doctor._id}
          >
            <img
              className="bg-indigo-50 group-hover:bg-primary transition-all duration-300"
              src={doctor?.image?.url}
              alt={`${doctor.name}-profile`}
            />
            <div className="p-4">
              <p className="text-neutral-800 text-lg font-medium">
                {doctor.name}
              </p>
              <p className="text-zinc-600 text-sm">{doctor.speciality}</p>
              <div className="mt-2 flex items-center gap-1 text-sm">
                <input
                  onChange={() => changeDoctorAvailability(doctor._id)}
                  type="checkbox"
                  checked={doctor.available}
                  className="h-4 w-4 text-primary border border-primary rounded cursor-pointer"
                />
                <p className="ml-2">Available</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default memo(AllDoctors);
