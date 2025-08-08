import { useContext, useState, useEffect, memo } from "react";
import { AdminContext } from "../../context/AdminContext";
<<<<<<< HEAD
import { Spinner } from "../../components/Spinner.jsx";
=======
import { Spinner } from "../../components/Spinner";
>>>>>>> 5fdc0ecf9ad8be357a937d0fd6933a9c969232b3
import axios from "axios";
import {
  Search,
  ChevronDown,
  ChevronUp,
  Filter,
  Edit,
  Trash,
  Eye,
} from "lucide-react";
import { toast } from "react-toastify";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import SearchFilterAppointment from "../../components/SearchFilterAppointment";
import { useNavigate } from "react-router-dom";

const AllDoctors = () => {
  const {
    doctors,
    doctorsloading,
    error,
    fetchDoctors,
    AdminTonken,
    backendUrl,
    changeDoctorAvailability,
  } = useContext(AdminContext);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [specialityFilter, setSpecialityFilter] = useState("all");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [doctorToDelete, setDoctorToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (AdminTonken) fetchDoctors();
  }, [AdminTonken]);

  // Filter and sort doctors
  useEffect(() => {
    if (!doctors) return;

    let filtered = [...doctors];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (doctor) =>
          doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doctor.speciality.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doctor.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply speciality filter
    if (specialityFilter !== "all") {
      filtered = filtered.filter(
        (doctor) => doctor.speciality === specialityFilter
      );
    }

    // Apply availability filter
    if (availabilityFilter !== "all") {
      filtered = filtered.filter(
        (doctor) => doctor.available === (availabilityFilter === "available")
      );
    }

    // Apply sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredDoctors(filtered);
  }, [doctors, searchTerm, sortConfig, specialityFilter, availabilityFilter]);

  // Get unique specialities for filter dropdown
  const uniqueSpecialities = doctors
    ? [...new Set(doctors.map((doctor) => doctor.speciality))]
    : [];

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (columnName) => {
    if (sortConfig.key !== columnName) {
      return null;
    }
    return sortConfig.direction === "ascending" ? (
      <ChevronUp className="h-4 w-4" />
    ) : (
      <ChevronDown className="h-4 w-4" />
    );
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSpecialityFilter("all");
    setAvailabilityFilter("all");
    setSortConfig({ key: null, direction: null });
  };

  // Handle delete doctor
  const handleDeleteClick = (doctor) => {
    setDoctorToDelete(doctor);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!doctorToDelete) return;

    try {
      setIsDeleting(true);
      const response = await axios.delete(
        `${backendUrl}/api/admin/delete-doctor/${doctorToDelete._id}`,
        {
          headers: {
            Authorization: `Bearer ${AdminTonken}`,
          },
        }
      );

      if (response.data.success) {
        // Remove the doctor from the local state
        fetchDoctors(); // Or update local state directly
        setIsDeleteModalOpen(false);
        // Show success message (you can use a toast notification here)
        toast.success(
          `Doctor ${doctorToDelete.name} has been deleted successfully`)
      } else {
        toast.error(
          `Failed to delete doctor ${doctorToDelete.name}`
        );
      }
    } catch (error) {
      console.error("Error deleting doctor:", error);
      alert(error.response?.data?.message || "Failed to delete doctor");
    } finally {
      setIsDeleting(false);
    }
  };

  if (doctorsloading) {
    return (
      <div className="flex items-center justify-center max-w-4xl m-auto min-h-[400px]">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-gray-600 font-medium">Loading doctors...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl m-auto flex items-center justify-center min-h-[400px]">
        <div className="text-center text-red-500">
          <p className="text-xl font-semibold">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen  px-4 py-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">
          All Doctors
        </h1>
        <button
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
          onClick={() => navigate("/add-doctor")}
        >
          Add New Doctor
        </button>
      </div>

      {/* Filters */}

      <SearchFilterAppointment
        uniqueSpecialities={uniqueSpecialities}
        searchTerm={searchTerm}
        handleSearch={handleSearch}
        specialityFilter={specialityFilter}
        setAvailabilityFilter={setAvailabilityFilter}
        setSpecialityFilter={setSpecialityFilter}
        availabilityFilter={availabilityFilter}
        clearFilters={clearFilters}
      />

      {/* Table for desktop */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto hidden md:block">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort("name")}
                >
                  <div className="flex items-center">
                    Doctor
                    {getSortIcon("name")}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort("speciality")}
                >
                  <div className="flex items-center">
                    Speciality
                    {getSortIcon("speciality")}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Experience
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Availability
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDoctors.length > 0 ? (
                filteredDoctors.map((doctor) => (
                  <tr key={doctor._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={doctor?.image?.url || "/placeholder.svg"}
                            alt={doctor.name}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {doctor.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {doctor.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {doctor.speciality}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {doctor.experience > 1
                          ? doctor.experience + " " + "Years"
                          : doctor.experience + " " + "Year" || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={doctor.available}
                          onChange={() => changeDoctorAvailability(doctor._id)}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
                        />
                        <span
                          className={`ml-2 text-sm ${
                            doctor.available ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {doctor.available ? "Available" : "Unavailable"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() =>
                            (window.location.href = `/doctors/${doctor._id}`)
                          }
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() =>
                            (window.location.href = `/edit-doctor/${doctor._id}`)
                          }
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-900"
                          onClick={() => handleDeleteClick(doctor)}
                        >
                          <Trash className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No doctors found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile view */}
        <div className="md:hidden">
          {filteredDoctors.length > 0 ? (
            filteredDoctors.map((doctor) => (
              <div key={doctor._id} className="border-b border-gray-200 p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <img
                      className="h-10 w-10 rounded-full object-cover"
                      src={doctor?.image?.url || "/placeholder.svg"}
                      alt={doctor.name}
                    />
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">
                        {doctor.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {doctor.speciality}
                      </div>
                    </div>
                  </div>
                  <div
                    className={`text-xs px-2 py-1 rounded-full ${
                      doctor.available
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {doctor.available ? "Available" : "Unavailable"}
                  </div>
                </div>

                <div className="mt-2 text-xs text-gray-500">
                  <p>{doctor.email}</p>
                  <p>{doctor.phone || "No phone"}</p>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={doctor.available}
                      onChange={() => changeDoctorAvailability(doctor._id)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
                    />
                    <span className="ml-2 text-xs">Toggle availability</span>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={() =>
                        (window.location.href = `/admin/doctors/${doctor._id}`)
                      }
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() =>
                        (window.location.href = `/admin/edit-doctor/${doctor._id}`)
                      }
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-900"
                      onClick={() => {
                        if (
                          window.confirm(
                            `Are you sure you want to delete ${doctor.name}?`
                          )
                        ) {
                          // Add delete functionality here
                        }
                      }}
                    >
                      <Trash className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-gray-500">
              No doctors found
            </div>
          )}
        </div>
      </div>

      {/* Empty state */}
      {doctors.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="mx-auto h-12 w-12 text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No doctors</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by adding a new doctor.
          </p>
          <div className="mt-6">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={() => (window.location.href = "/admin/add-doctor")}
            >
              <svg
                className="-ml-1 mr-2 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              Add Doctor
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Doctor"
        message="Are you sure you want to delete this doctor? This action cannot be undone and will remove all associated data."
        itemName={
          doctorToDelete
            ? `Dr. ${doctorToDelete.name} (${doctorToDelete.speciality})`
            : ""
        }
        confirmButtonText="Delete Doctor"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default memo(AllDoctors);
