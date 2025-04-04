import React, { useState, useContext, useRef } from "react";
import { assets } from "../../assets/assets";
import axios from "axios";
import { AdminContext } from "../../context/AdminContext";
import { toast } from "react-toastify";
const AddDoctor = () => {
  const { backendUrl } = useContext(AdminContext);
  const inputRef = useRef("");
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [doctorData, setDoctorData] = useState({
    name: "",
    email: "",
    password: "",
    speciality: "",
    experience: "",
    fees: "",
    image: "",
    about: "",
    available: true,
    address: {
      line1: "",
      line2: "",
    },
    workingHours: [
      {
        day: "",
        startTime: "",
        endTime: "",
      },
    ],
  });

  console.log(doctorData.workingHours);
 const formatTime = (time) => {
   if (!time) return "";
   const [hours, minutes] = time.split(":");
   const hour = parseInt(hours, 10);
   const period = hour >= 12 ? "PM" : "AM";
   const formattedHour = hour % 12 || 12;
   return `${formattedHour}:${minutes} ${period}`;
 };


  // Handle input change for normal fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDoctorData({ ...doctorData, [name]: value });
  };

  // Handle input change for address fields
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setDoctorData({
      ...doctorData,
      address: { ...doctorData.address, [name]: value },
    });
  };

  // Handle input change for working hours
 const handleWorkingHourChange = (index, e) => {
  const { name, value } = e.target;
   const updatedWorkingHours = [...doctorData.workingHours];
   updatedWorkingHours[index][name] = value; // Keep 24-hour format

   setDoctorData((prevDoctor) => ({
     ...prevDoctor,
     workingHours: updatedWorkingHours,
   }));
 };


  // Add new working hour entry
  const addWorkingHour = () => {
    setDoctorData({
      ...doctorData,
      workingHours: [
        ...doctorData.workingHours,
        { day: "", startTime: "", endTime: "" },
      ],
    });
  };

  // Remove a working hour entry
  const removeWorkingHour = (index) => {
    const updatedWorkingHours = doctorData.workingHours.filter(
      (_, i) => i !== index
    );
    setDoctorData({ ...doctorData, workingHours: updatedWorkingHours });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    console.log(file);

    setDoctorData({ ...doctorData, image: file });
    setImagePreview(URL.createObjectURL(file));
  };

  const validateForm = () => {
    if (
      !doctorData.name ||
      !doctorData.email ||
      !doctorData.address.line1 ||
      !doctorData.workingHours.length ||
      !doctorData.image ||
      !doctorData.speciality ||
      !doctorData.degree ||
      !doctorData.experience ||
      !doctorData.fees ||
      !doctorData.about ||
      !doctorData.available ||
      !doctorData.password
    ) {
      toast.error("All fields are required");
      return false;
    }
    if (!doctorData.email.includes("@")) {
      toast.error("Invalid email format. Please enter a valid email address.");
      return false;
    }
    if (doctorData.password.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    const formData = new FormData();
    for (let key in doctorData) {
      if (key === "workingHours") {
        formData.append(key, JSON.stringify(doctorData[key]));
      } else if (key === "address") {
        formData.append("line1", doctorData.address.line1);
        formData.append("line2", doctorData.address.line2);
      } else {
        formData.append(key, doctorData[key]);
      }
    }
    try {
      setLoading(true);
      const res = await axios.post(
        `${backendUrl}/api/admin/add-doctor`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log(res);
      if (res.data.success) {
        toast.success(res.data.message);
        setDoctorData({
          name: "",
          email: "",
          password: "",
          speciality: "",
          experience: "",
          fees: "",
          image: "",
          about: "",
          available: true,
          address: {
            line1: "",
            line2: "",
          },
          workingHours: [
            {
              day: "",
              startTime: "",
              endTime: "",
            },
          ],
        });
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white w-full border border-gray-300 mt-9 px-6 py-10 shadow-md rounded-lg max-h-[80vh] max-w-4xl overflow-y-scroll">
      <h1 className="text-2xl font-semibold m-auto w-fit">Add New Doctor</h1>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        {/* Basic Information */}
        <div className="bg-[#F8F9FD] mt-4 rounded-lg py-4 px-6">
          <h3 className="text-gray-900 text-2xl">Basic Information</h3>
          <div className="flex gap-4 flex-wrap mt-3">
            <div className="w-[340px]">
              <label className="text-base">Full Name*</label>
              <input
                type="text"
                name="name"
                className="border rounded-md w-full h-10 px-3"
                value={doctorData.name}
                onChange={handleInputChange}
              />
            </div>

            <div className="w-[340px]">
              <label className="text-base">Email Address*</label>
              <input
                type="email"
                name="email"
                className="border rounded-md w-full h-10 px-3"
                value={doctorData.email}
                onChange={handleInputChange}
              />
            </div>

            <div className="w-[340px]">
              <label className="text-base">Password*</label>
              <input
                type="password"
                name="password"
                className="border rounded-md w-full h-10 px-3"
                value={doctorData.password}
                onChange={handleInputChange}
              />
            </div>

            <div className="w-[340px]">
              <label className="text-base">Speciality*</label>
              <input
                type="text"
                name="speciality"
                className="border rounded-md w-full h-10 px-3"
                value={doctorData.speciality}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        {/* Professional Details*/}
        <div className="bg-[#F8F9FD] h-fit mt-4 rounded-lg py-4 px-6">
          <h3 className="text-gray-900 text-2xl">Basic Information</h3>
          <div className="flex gap-4 flex-wrap mt-3">
            <div className="w-[340px]">
              <label htmlFor="degree" className="text-base">
                Degree*
              </label>
              <input
                className="border rounded-md w-full h-10 px-3"
                type="text"
                name="degree"
                value={doctorData.degree}
                onChange={handleInputChange}
              />
            </div>

            <div className="w-[340px]">
              <label className="text-base" htmlFor="experience">
                Experience (years)*
              </label>
              <input
                type="number"
                name="experience"
                className="border rounded-md w-full h-10 px-3"
                value={doctorData.experience}
                onChange={handleInputChange}
              />
            </div>

            <div className="w-[340px]">
              <label className="text-base" htmlFor="fees">
                Consultation Fees*
              </label>
              <input
                type="number"
                name="fees"
                className="border rounded-md w-full h-10 px-3"
                value={doctorData.fees}
                onChange={handleInputChange}
              />
            </div>

            <div className="w-[340px]">
              <label htmlFor="available" className="text-base">
                Availability Status
              </label>
              <select
                type="text"
                name="available"
                className="border rounded-md w-full h-10 px-3"
                value={doctorData.available}
                onChange={handleInputChange}
              >
                <option value="true">Available</option>
                <option value="false">Not Available</option>
              </select>
            </div>

            <div className="w-full ">
              <label className="text-base" htmlFor="about">
                About Doctor*
              </label>
              <textarea
                name="about"
                className="border rounded-md w-full h-32 px-3"
                value={doctorData.about}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        {/* Profile Image */}
        <div className="bg-[#F8F9FD] mt-4 rounded-lg py-4 px-6">
          <h3 className="text-gray-900 text-2xl">Profile Image</h3>
          <div className="flex items-center gap-3">
            <img
              onClick={() => inputRef.current.click()}
              className="cursor-pointer w-32 h-32 rounded-full object-fill"
              src={doctorData.image ? imagePreview : assets.upload_area}
              alt="upload_area"
            />
            <input
              onChange={handleImageChange}
              type="file"
              name="image"
              ref={inputRef}
            />
          </div>
        </div>

        {/* Address Details */}
        <div className="bg-[#F8F9FD] mt-4 rounded-lg py-4 px-6">
          <h3 className="text-gray-900 text-2xl">Address Details</h3>
          <div className="flex flex-col gap-4 flex-wrap mt-3">
            <div className="w-full">
              <label className="text-base">Line1*</label>
              <input
                type="text"
                name="line1"
                className="border rounded-md w-full h-10 px-3"
                value={doctorData.address.line1}
                onChange={handleAddressChange}
              />
            </div>

            <div className="w-full">
              <label className="text-base">Line2*</label>
              <input
                type="text"
                name="line2"
                className="border rounded-md w-full h-10 px-3"
                value={doctorData.address.line2}
                onChange={handleAddressChange}
              />
            </div>
          </div>
        </div>

        {/* Working Hours */}
        <div className="bg-[#F8F9FD] h-fit mt-4 rounded-lg py-4 px-6">
          <h3 className="text-gray-900 text-2xl">Working Hours</h3>
          {doctorData.workingHours.map((hour, index) => (
            <div
              key={index}
              className="bg-white p-2 rounded-md flex gap-4 flex-wrap mt-3 items-center"
            >
              <div className="w-[260px]">
                <label className="text-base">Day</label>
                <select
                  name="day"
                  className="border rounded-md w-full h-10 px-3"
                  value={hour.day}
                  onChange={(e) => handleWorkingHourChange(index, e)}
                >
                  <option value="">Select Day</option>
                  <option value="Monday">Monday</option>
                  <option value="Tuesday">Tuesday</option>
                  <option value="Wednesday">Wednesday</option>
                  <option value="Thursday">Thursday</option>
                  <option value="Friday">Friday</option>
                  <option value="Saturday">Saturday</option>
                  <option value="Sunday">Sunday</option>
                </select>
              </div>

              <div className="w-[160px]">
                <label className="text-base">Start Time</label>
                <input
                  type="time"
                  name="startTime"
                  className="border rounded-md w-full h-10 px-3"
                  value={hour.startTime}
                  onChange={(e) => handleWorkingHourChange(index, e)}
                />
              </div>

              <div className="w-[160px]">
                <label className="text-base">End Time</label>
                <input
                  type="time"
                  name="endTime"
                  className="border rounded-md w-full h-10 px-3"
                  value={hour.endTime}
                  onChange={(e) => handleWorkingHourChange(index, e)}
                />
              </div>

              <button
                type="button"
                className="bg-red-500 text-white py-2 px-5 rounded-md"
                onClick={() => removeWorkingHour(index)}
                disabled={doctorData.workingHours.length === 1} // Prevent deleting the last one
                hidden={doctorData.workingHours.length <= 1}
              >
                Remove
              </button>
            </div>
          ))}

          <button
            type="button"
            className="bg-primary text-white py-2 px-5 rounded-md mt-3"
            onClick={addWorkingHour}
          >
            Add More Working Hours
          </button>
        </div>

        <button
          className="bg-primary text-white py-2 px-5 rounded-md mt-3"
          disabled={loading}
        >
          {loading ? "Adding Doctor..." : "Add Doctor"}
        </button>
      </form>
    </div>
  );
};

export default AddDoctor;
