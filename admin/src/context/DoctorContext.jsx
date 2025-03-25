import { createContext } from "react";
import React from "react";

export const DoctorContext = createContext(null);

const DoctorContextProvidor = ({ children }) => {
  const value = {};
  return (
    <DoctorContext.Provider value={value}>{children}</DoctorContext.Provider>
  );
};

export default DoctorContextProvidor;
