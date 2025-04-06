import { createContext, useState } from "react";
import React from "react";
import axios from "axios";

export const DoctorContext = createContext(null);

const DoctorContextProvidor = ({ children }) => {
    const backendUrl = import.meta.env.VITE_API_URL;

  const [doctorToken, setDoctorToken] = useState(
    localStorage.getItem("doctoken") ? localStorage.getItem("doctoken") : ""
  );
   const [appointmentsCount, setAppointmentsCount] = useState(0);
   const [latestAppoinments, setLatestAppoinments] = useState([]);
   const [doctorsCount, setDoctorsCount] = useState(1);
   const [patientsCount, setPatientsCount] = useState(0);
   const [loading, setLoading] = useState(false);
   const getCounts = async () => {
     setLoading(true);
     try {
       const { data } = await axios.get(
         `${backendUrl}/api/doctor/doc/appointments`,
         {
           headers: {
             Authorization: `Bearer ${doctorToken}`,
           },
         }
       );
       console.log(data);
       setLatestAppoinments(data.appointments?.slice(0, 3));
     
       setAppointmentsCount(data.appointments.length);
       setPatientsCount(data.uniquePatientCount);
     } catch (error) {
       console.log(error);
     } finally {
       setLoading(false);
     }
   };

  const value = {
    doctorToken,
    setDoctorToken,
    appointmentsCount,
    latestAppoinments,
    doctorsCount,
    patientsCount,
    loading,
    getCounts,
    backendUrl
  };
  return (
    <DoctorContext.Provider value={value}>{children}</DoctorContext.Provider>
  );
};

export default DoctorContextProvidor;
