import React, { createContext, useEffect, useState } from "react";
import { specialityData } from "../assets/assets";
import axios from "axios";

export const projectContext = createContext(null);

const Context = ({ children }) => {
  const backendUrl = import.meta.env.VITE_API_URL;

  const [token, setToken] = useState(true);
  const [doctors, setDoctors] = useState([]);
  const getDoctors = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/doctor/`);
      console.log(data);
      if (data.success) {
        setDoctors(data.doctors);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getDoctors();
  }, []);

  const project = {
    specialityData,
    doctors,
    token,
    setToken,
    specialityData,
    backendUrl,
  };
  return (
    <projectContext.Provider value={project}>
      {children}
    </projectContext.Provider>
  );
};

export default Context;
