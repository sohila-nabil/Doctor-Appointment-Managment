import React, { createContext, useState } from "react";
import { specialityData, doctors } from "../assets/assets";

export const projectContext = createContext(null);

const Context = ({ children }) => {
  const [token, setToken] = useState(true);

  const project = {
    specialityData,
    doctors,
    token,
    setToken,
    specialityData,
  };
  return (
    <projectContext.Provider value={project}>
      {children}
    </projectContext.Provider>
  );
};

export default Context;
