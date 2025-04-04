import React, { useContext, useState, useEffect, useRef } from "react";
import { assets } from "../assets/assets";
import { projectContext } from "../context/Context";
import axios from "axios";
import { Spinner } from "../components/Spinner";
import { toast } from "react-toastify";

const Profile = () => {
  const { userData, setUserData, backendUrl, token, loadingUser } =
    useContext(projectContext);
  const inputRef = useRef();
  const [isEdit, setIsEdit] = useState(false);
  const [imagePreview, setImagePreview] = useState(false);
  console.log(userData);

  const updateProfileData = async () => {
    const formData = new FormData();
    formData.append("name", userData.name);
    formData.append("email", userData.email);
    formData.append("phone", userData.phone);
    formData.append("dob", userData.dob);
    formData.append("address", JSON.stringify(userData.address));
    formData.append("image", userData.image);
    formData.append("gender", userData.gender);

    try {
      const { data } = await axios.put(
        `${backendUrl}/api/user/update-user`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(data);

      if (data.success) {
        toast.success(data.message);
        setUserData(data.user);
        setIsEdit(false);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.response.data.message);
    } finally {
      setIsEdit(false);
    }
  };

  if (loadingUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-lg flex flex-col gap-2 text-sm mt-28">
      {isEdit ? (
        <>
          <input
            type="file"
            ref={inputRef}
            onChange={(e) => {
              const url = URL.createObjectURL(e.target.files[0]);
              setUserData({ ...userData, image: e.target.files[0] });
              setImagePreview(url);
            }}
            hidden
          />
          <img
            className="w-36 rounded cursor-pointer"
            src={
              imagePreview ||
              userData?.image?.url ||
              userData.image ||
              assets.upload_area
            }
            alt="user-image"
            onClick={() => inputRef.current.click()}
          />
        </>
      ) : (
        <img
          className="w-36 rounded"
          src={userData?.image?.url || userData.image}
          alt="user-image"
        />
      )}

      {isEdit ? (
        <input
          className="bg-gray-100 text-3xl font-medium max-w-60 mt-4 border border-black"
          type="text"
          value={userData.name}
          onChange={(e) => setUserData({ ...userData, name: e.target.value })}
        />
      ) : (
        <p className="text-3xl font-medium text-neutral-800 mt-4">
          {userData.name}
        </p>
      )}

      <hr className="bg-zinc-400 h-[1px] border-none " />

      <div>
        <p className="text-neutral-500 underline mt-3">CONTACT INFORMATION</p>
        <div className=" grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700">
          <p className="font-medium">Email id: </p>
          <p className="text-blue-500">{userData.email}</p>
          <p className="font-medium">Phone : </p>
          {isEdit ? (
            <input
              className="bg-gray-100 max-w-52"
              type="text"
              value={userData.phone}
              onChange={(e) =>
                setUserData({ ...userData, phone: e.target.value })
              }
            />
          ) : (
            <p className="text-blue-400">{userData.phone}</p>
          )}
          <p className="font-medium">Address :</p>
          {isEdit ? (
            <p>
              <input
                className="bg-gray-50"
                type="text"
                value={userData.address?.line1 || ""}
                onChange={(e) =>
                  setUserData({
                    ...userData,
                    address: {
                      ...userData.address,
                      line1: e.target.value || "",
                    },
                  })
                }
              />
              <br />
              <input
                className="bg-gray-50"
                type="text"
                value={userData.address?.line2 || ""}
                onChange={(e) =>
                  setUserData({
                    ...userData,
                    address: {
                      ...userData.address,
                      line2: e.target.value || "",
                    },
                  })
                }
              />
            </p>
          ) : (
            <p className="text-gray-500 ">
              {userData?.address?.line1 || ""}
              <br />
              {userData?.address?.line2 || ""}
            </p>
          )}
        </div>
      </div>

      <div>
        <p className="text-neutral-500 underline mt-3">BASIC INFORMATION</p>
        <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 text-neutral-700">
          <p className="font-medium">Gender : </p>
          {isEdit ? (
            <select
              className="max-w-20 bg-gray-100"
              value={userData.gender}
              onChange={(e) =>
                setUserData({ ...userData, gender: e.target.value })
              }
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          ) : (
            <p className="text-gray-400">{userData.gender}</p>
          )}
          <p className="font-medium">Birthday : </p>
          {isEdit ? (
            <input
              className="max-w-28 bg-gray-100"
              type="date"
              value={userData.dob}
              onChange={(e) =>
                setUserData({ ...userData, dob: e.target.value })
              }
            />
          ) : (
            <p className="text-gray-400">{userData.dob}</p>
          )}
        </div>
      </div>

      <div>
        {isEdit ? (
          <button
            className="border border-[#5F6FFF] px-8 py-2 rounded-full hover:bg-[#5F6FFF] hover:text-white transition-all"
            onClick={updateProfileData}
          >
            Save information
          </button>
        ) : (
          <button
            className="border border-[#5F6FFF] px-8 py-2 rounded-full hover:bg-[#5F6FFF] hover:text-white transition-all"
            onClick={() => setIsEdit(true)}
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
};

export default Profile;
