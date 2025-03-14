import React, { useState } from "react";

const Login = () => {
  const [state, setState] = useState("Sign Up");
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const handleOnSubmit = (e) => {
    e.preventDefault();
    console.log(userData);
  };
  console.log(userData);
  
  return (
    <form onSubmit={handleOnSubmit} className="min-h-[80vh] flex items-center">
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
              value={userData.username}
              onChange={(e) =>
                setUserData({ ...userData, username: e.target.value })
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
        <button className="bg-[#5F6FFF] text-white w-full py-2 rounded-md text-base">
          {state === "Sign Up" ? "Create an Account" : "Login"}
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
            Create a new account?{" "}
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
