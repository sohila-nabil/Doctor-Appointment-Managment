import React, { createContext, useEffect, useState } from "react";
import { specialityData } from "../assets/assets";
import axios from "axios";

export const projectContext = createContext(null);

const Context = ({ children }) => {
  const backendUrl = import.meta.env.VITE_API_URL;

  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [userData, setUserData] = useState({});
  const [doctors, setDoctors] = useState([]);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
 
  const getDoctors = async () => {
    setLoadingDoctors(true); // Start loading
    try {
      const { data } = await axios.get(`${backendUrl}/api/doctor/`);
      if (data.success) {
        setDoctors(data.doctors);
      }
    } catch (error) {
      console.log("Error fetching doctors:", error);
    } finally {
      setLoadingDoctors(false); // Stop loading
    }
  };

  const getUserData = async () => {
    setLoadingUser(true); // Start loading
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/getuser`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserData(data.user);
    } catch (error) {
      console.log("Error fetching user data:", error);
    } finally {
      setLoadingUser(false); // Stop loading
    }
  };

  const getUserAppointments = async () => {
    setLoadingUserAppoinments(true); // Start loading
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/user/getuser-appointments`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data.success) {
        setUserAppoinments(data.appointments);
      }
      else {
        setUserAppoinments([]);
      }
    } catch (error) {
      console.log("Error fetching user appointments data:", error);
    } finally {
      setLoadingUserAppoinments(false); // Stop loading
    }
  };

  useEffect(() => {
    if (token) getUserData();
  }, [token]);

  useEffect(() => {
    if (token) getDoctors();
  }, [token]);

  
  const project = {
    specialityData,
    doctors,
    loadingDoctors,
    token,
    setToken,
    backendUrl,
    userData,
    setUserData,
    loadingUser,
    getDoctors,
  };

  return (
    <projectContext.Provider value={project}>
      {children}
    </projectContext.Provider>
  );
};

export default Context;
