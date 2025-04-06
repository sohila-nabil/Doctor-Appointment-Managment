import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Award,
  Briefcase,
  Star,
  Edit,
  Loader,
  User,
  Heart,
  ThumbsUp,
} from "lucide-react";
import { AdminContext } from "../context/AdminContext";

const DoctorDetails = () => {
  const { backendUrl } = useContext(AdminContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("about");

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        setLoading(true);
        // Fetch doctor details
        const { data } = await axios.get(`${backendUrl}/api/doctor/${id}`);
        if (data.success) {
          setDoctor(data.doctor);
          console.log(data);
        } else {
          setError(data.message || "Failed to fetch doctor details");
        }
      } catch (error) {
        console.error("Error fetching doctor details:", error);
        setError(
          error.response?.data?.message || "Failed to fetch doctor details"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorDetails();
  }, [id]);

  if (loading && !doctor) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6">
          <div className="text-center py-10">
            <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-500 text-2xl">!</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Error Loading Doctor
            </h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => {
                navigate(-1), scrollTo(0, 0);
              }}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6">
          <div className="text-center py-10">
            <div className="h-16 w-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-yellow-500 text-2xl">?</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Doctor Not Found
            </h2>
            <p className="text-gray-600 mb-6">
              The doctor you're looking for doesn't exist or has been removed.
            </p>
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-indigo-600 hover:text-indigo-800 mb-6"
      >
        <ArrowLeft className="h-5 w-5 mr-1" />
        <span>Back</span>
      </button>

      <div className="max-w-5xl mx-auto">
        {/* Doctor Header */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
          <div className="md:flex">
            <div className="md:w-1/3">
              {doctor.image?.url ? (
                <img
                  src={doctor.image.url || "/placeholder.svg"}
                  alt={doctor.name}
                  className="w-full h-64 md:h-full object-cover"
                />
              ) : (
                <div className="w-full h-64 md:h-full bg-gray-200 flex items-center justify-center">
                  <User className="h-20 w-20 text-gray-400" />
                </div>
              )}
            </div>
            <div className="p-6 md:w-2/3">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-1">
                    Dr. {doctor.name}
                  </h1>
                  <p className="text-indigo-600 font-medium">
                    {doctor.speciality}
                  </p>

                  <div className="flex items-center mt-2">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400" />
                      <Star className="h-4 w-4 text-yellow-400" />
                      <Star className="h-4 w-4 text-yellow-400" />
                      <Star className="h-4 w-4 text-yellow-400" />
                      <Star className="h-4 w-4 text-gray-300" />
                    </div>
                    <span className="text-sm text-gray-500 ml-2">(4.0)</span>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      doctor.available
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {doctor.available ? "Available" : "Unavailable"}
                  </span>

                  <button
                    onClick={() => navigate(`/admin/edit-doctor/${doctor._id}`)}
                    className="flex items-center mt-2 text-sm text-blue-600 hover:text-blue-800"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit Profile
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                {doctor.experience && (
                  <div className="flex items-center">
                    <Briefcase className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">Experience</p>
                      <p className="font-medium">{doctor.experience} years</p>
                    </div>
                  </div>
                )}

                {doctor.education && (
                  <div className="flex items-center">
                    <Award className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">Education</p>
                      <p className="font-medium">{doctor.education}</p>
                    </div>
                  </div>
                )}

                {doctor.consultationFee && (
                  <div className="flex items-center">
                    <div className="h-5 w-5 text-gray-400 mr-2 flex items-center justify-center">
                      $
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Consultation Fee</p>
                      <p className="font-medium">${doctor.consultationFee}</p>
                    </div>
                  </div>
                )}

                {doctor.languages && (
                  <div className="flex items-center">
                    <div className="h-5 w-5 text-gray-400 mr-2 flex items-center justify-center">
                      🗣️
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Languages</p>
                      <p className="font-medium">
                        {doctor.languages.join(", ")}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
          <div className="border-b">
            <nav className="flex -mb-px">
              <button
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === "about"
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                onClick={() => setActiveTab("about")}
              >
                About
              </button>
              <button
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === "schedule"
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                onClick={() => setActiveTab("schedule")}
              >
                Schedule
              </button>
              <button
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === "reviews"
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                onClick={() => setActiveTab("reviews")}
              >
                Reviews
              </button>
              <button
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === "contact"
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                onClick={() => setActiveTab("contact")}
              >
                Contact
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* About Tab */}
            {activeTab === "about" && (
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  About Dr. {doctor.name}
                </h2>

                {doctor.about ? (
                  <p className="text-gray-600 mb-6">{doctor.about}</p>
                ) : (
                  <p className="text-gray-500 italic mb-6">
                    No biography available.
                  </p>
                )}

                {doctor.speciality && (
                  <div className="mb-6">
                    <h3 className="text-md font-medium text-gray-900 mb-2">
                      Specializations
                    </h3>
                    <ul className="list-disc pl-5 text-gray-600">
                      {doctor.speciality}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Schedule Tab */}
            {activeTab === "schedule" && (
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Working Hours
                </h2>

                {doctor.workingHours.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {doctor.workingHours.map((slot) => (
                      <div
                        key={slot._id}
                        className="flex justify-between p-3 border rounded-md"
                      >
                        <div className="font-medium">{slot.day}</div>
                        <div className="text-gray-600">
                          {slot.startTime || "Closed"}
                        </div>
                        <div className="text-gray-600">
                          {slot.endTime || "Closed"}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">
                    No schedule information available.
                  </p>
                )}

                <div className="mt-6">
                  <h3 className="text-md font-medium text-gray-900 mb-2">
                    Appointment Duration
                  </h3>
                  <p className="text-gray-600">
                    {doctor.appointmentDuration || 30} minutes per appointment
                  </p>
                </div>
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === "reviews" && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium text-gray-900">
                    Patient Reviews
                  </h2>
                  <div className="flex items-center">
                    <div className="flex items-center">
                      <Star className="h-5 w-5 text-yellow-400" />
                      <span className="ml-1 text-lg font-medium">4.0</span>
                    </div>
                    <span className="text-sm text-gray-500 ml-2">
                      (24 reviews)
                    </span>
                  </div>
                </div>

                {/* Sample reviews - replace with actual reviews from API */}
                <div className="space-y-6">
                  <div className="border-b pb-4">
                    <div className="flex justify-between mb-2">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-medium">
                          JD
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium">John Doe</p>
                          <p className="text-xs text-gray-500">2 months ago</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400" />
                        <Star className="h-4 w-4 text-yellow-400" />
                        <Star className="h-4 w-4 text-yellow-400" />
                        <Star className="h-4 w-4 text-yellow-400" />
                        <Star className="h-4 w-4 text-yellow-400" />
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm">
                      Dr. {doctor.name} was very professional and knowledgeable.
                      The consultation was thorough and I felt heard. Would
                      definitely recommend!
                    </p>
                  </div>

                  <div className="border-b pb-4">
                    <div className="flex justify-between mb-2">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-800 font-medium">
                          MS
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium">Mary Smith</p>
                          <p className="text-xs text-gray-500">3 months ago</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400" />
                        <Star className="h-4 w-4 text-yellow-400" />
                        <Star className="h-4 w-4 text-yellow-400" />
                        <Star className="h-4 w-4 text-gray-300" />
                        <Star className="h-4 w-4 text-gray-300" />
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm">
                      Good doctor but had to wait a long time for my
                      appointment. The treatment was effective though.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Contact Tab */}
            {activeTab === "contact" && (
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Contact Information
                </h2>

                <div className="space-y-4">
                  {doctor.email && (
                    <div className="flex items-center">
                      <Mail className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{doctor.email}</p>
                      </div>
                    </div>
                  )}

                  {doctor.address && (
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-gray-400 mr-3 mt-1" />
                      <div>
                        <p className="text-sm text-gray-500">Address</p>
                        <div className="font-medium">
                          <p>{doctor.address.line1}</p>
                          {doctor.address.line2 && (
                            <p>{doctor.address.line2}</p>
                          )}
                          <p>
                            {doctor.address.city}, {doctor.address.state}{" "}
                            {doctor.address.zipCode}
                          </p>
                          {doctor.address.country && (
                            <p>{doctor.address.country}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetails;
