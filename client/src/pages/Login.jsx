import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { projectContext } from "../context/Context";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
const Login = () => {
  const navigate = useNavigate();
  const [state, setState] = useState("Sign Up");
  const [loading, setLoading] = useState(false);
  const { backendUrl, setToken, token } = useContext(projectContext);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
  });
  let url;
  if (state === "Sign Up") {
    url = `${backendUrl}/api/user/register`;
  } else {
    url = `${backendUrl}/api/user/login`;
  }

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(url, userData);
      if (data.success) {
        setToken(data.token);
        localStorage.setItem("token", data.token);
      }
      toast.success(data.message);
      console.log(data);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token]);

  return (
    <form
      onSubmit={handleOnSubmit}
      className="min-h-[80vh] flex items-center mt-28"
    >
      <div className="flex flex-col gap-3 m-auto items-start p-3 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600  text-sm shadow-lg">
        <p className="text-2xl font-semibold">
          {state === "Sign Up" ? "Create an Account" : "Login"}
        </p>
        <p>
          Please {state === "Sign Up" ? "sign up" : "login"} to book appointment
        </p>

        {state === "Sign Up" && (
          <div className="w-full">
            <p>Full Name</p>
            <input
              className="border border-zinc-300 rounded w-full p-2 mt-1"
              type="text"
              value={userData.name}
              onChange={(e) =>
                setUserData({ ...userData, name: e.target.value })
              }
            />
          </div>
        )}

        <div className="w-full">
          <p>Email</p>
          <input
            className="border border-zinc-300 rounded w-full p-2 mt-1"
            type="email"
            value={userData.email}
            onChange={(e) =>
              setUserData({ ...userData, email: e.target.value })
            }
          />
        </div>

        <div className="w-full">
          <p>Password</p>
          <input
            className="border border-zinc-300 rounded w-full p-2 mt-1"
            type="password"
            value={userData.password}
            onChange={(e) =>
              setUserData({ ...userData, password: e.target.value })
            }
          />
        </div>
        <button
          disabled={loading}
          className="bg-[#5F6FFF] text-white w-full py-2 rounded-md text-base"
        >
          {loading
            ? "Loading..."
            : state === "Sign Up"
            ? "Create an Account"
            : "Login"}
        </button>
        {state === "Sign Up" ? (
          <p>
            Already have an account?
            <span
              className="text-[#5F6FFF] underline cursor-pointer"
              onClick={() => setState("login")}
            >
              Login here
            </span>
          </p>
        ) : (
          <p>
            Create a new account?
            <span
              className="text-[#5F6FFF] underline cursor-pointer"
              onClick={() => setState("Sign Up")}
            >
              click here
            </span>
          </p>
        )}
      </div>
    </form>
  );
};

export default Login;
