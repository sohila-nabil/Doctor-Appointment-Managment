import {
  createContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import axios from "axios";
import { toast } from "react-toastify";
export const AdminContext = createContext(null);

const AdminContextProvidor = ({ children }) => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [AdminTonken, setAdminToken] = useState(
    localStorage.getItem("token") ? localStorage.getItem("token") : ""
  );
  const backendUrl = import.meta.env.VITE_API_URL;

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${backendUrl}/api/admin/doctors`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log(res);
      if (res.data.doctors.length === 0) {
        setError("no doctors found");
      }
      setDoctors(res.data.doctors);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch doctors");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const changeDoctorAvailability = async (id) => {
    try {
      const { data } = await axios.put(
        `${backendUrl}/api/admin/doctor/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (data.success) {
        toast.success(data.message);
        setDoctors((prevDoctors) =>
          prevDoctors.map((doctor) =>
            doctor._id === id
              ? { ...doctor, available: !doctor.available }
              : doctor
          )
        );
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to update availability");
    }
  };

  const value = {
    AdminTonken,
    setAdminToken,
    backendUrl,
    doctors,
    loading,
    error,
    setLoading,
    setError,
    setDoctors,
    fetchDoctors,
    changeDoctorAvailability,
  };
  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
};

export default AdminContextProvidor;
