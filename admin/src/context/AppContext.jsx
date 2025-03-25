import { createContext } from "react";
import React from "react";

export const AppContext = createContext(null);

const AppContextProvidor = ({ children }) => {
  const value = {};
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContextProvidor;
