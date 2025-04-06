import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { ChevronLeft, ChevronRight, Loader } from "lucide-react";
import SearchFilter from "../../components/SearchFilter";
import { toast } from "react-toastify";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import { DoctorContext } from "../../context/DoctorContext";

const DoctorApointments = () => {
  const { backendUrl, doctorToken } = useContext(DoctorContext);
  const [appointments, setAppointments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchAppointments = async (page) => {
    setLoading(true);
    try {
      // Build query parameters
      const params = new URLSearchParams();
      params.append("page", page);

      if (searchTerm) params.append("search", searchTerm);
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (dateFilter) params.append("date", dateFilter);

      const { data } = await axios.get(
        `${backendUrl}/api/doctor/doc/appointments?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${doctorToken}`,
          },
        }
      );
     console.log(data);
     
      if (data.success) {
        setAppointments(data.appointments);
        setCurrentPage(data.currentPage);
        setTotalPages(data.totalPages);
      } else {
        setError("Failed to fetch appointments");
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setError(error.response?.data?.message || "Failed to fetch appointments");
    } finally {
      setLoading(false);
    }
  };

 
  useEffect(() => {
    fetchAppointments(currentPage);
  }, [currentPage]);

  useEffect(() => {
    fetchAppointments(1); // Fetch filtered data immediately when any filter changes
  }, [searchTerm, statusFilter, dateFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when searching
    fetchAppointments(1);
  };

  // const handleFilterChange = () => {
  //   setCurrentPage(1); // Reset to first page when filtering
  //   fetchAppointments(1);
  // };


  const handleFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusBadge = (appointment) => {
    if (appointment.isCancelled) {
      return (
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
          Cancelled
        </span>
      );
    } else if (appointment.isPaid) {
      return (
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
          Paid
        </span>
      );
    } else {
      return (
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
          Pending
        </span>
      );
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      const { data } = await axios.put(
        `${backendUrl}/api/appointment/${appointmentToDelete._id}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${doctorToken}`,
          },
        }
      );
      if (data.success) {
        toast.success("Appointment cancelled successfully");
        setIsDeleteModalOpen(false);
        setIsDeleting(true);
        await fetchAppointments(currentPage);
        setIsDeleting(false);
        setAppointmentToDelete(null);
      }
    } catch (error) {
      console.error("Error deleting appointment:", error);
    }
  };

  return (
    <div className="w-full mx-5 my-2 p-5 bg-white shadow-md rounded-lg">
      {/* Filters */}

      <SearchFilter
        handleSearch={handleSearch}
        searchTerm={searchTerm}
        dateFilter={dateFilter}
        statusFilter={statusFilter}
        setSearchTerm={setSearchTerm}
        setDateFilter={setDateFilter}
        setStatusFilter={setStatusFilter}
        handleFilterChange={handleFilterChange}
      />

      {/* Loading state */}
      {loading && appointments.length === 0 && (
        <div className="flex justify-center items-center h-64">
          <Loader className="h-8 w-8 animate-spin text-gray-500" />
        </div>
      )}

      {/* Error state */}
      {error && appointments.length === 0 && (
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <p className="text-red-500 mb-2">{error}</p>
            <button
              onClick={() => fetchAppointments(currentPage)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Table for desktop */}
      {appointments.length > 0 && (
        <div className="overflow-x-auto hidden sm:block">
          <table className="w-full table-auto">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Doctor
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {appointments.map((appointment) => (
                <tr key={appointment._id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {appointment.userId?.name || "N/A"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {appointment.userId?.email || "N/A"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {appointment.doctorId?.image?.url && (
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={
                              appointment.doctorId.image.url ||
                              "/placeholder.svg"
                            }
                            alt="Doctor"
                          />
                        </div>
                      )}
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {appointment.doctorId?.name || "N/A"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {appointment.doctorId?.speciality || "N/A"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {appointment.date}
                    </div>
                    <div className="text-sm text-gray-500">
                      {appointment.time}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {getStatusBadge(appointment)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {appointment.isPaid ? (
                      <div>
                        <div className="text-green-600 font-medium">Paid</div>
                        {appointment.paidAt && (
                          <div className="text-xs text-gray-500">
                            {formatDate(appointment.paidAt)}
                          </div>
                        )}
                      </div>
                    ) : (
                      "Not Paid"
                    )}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                      onClick={() =>
                        (window.location.href = `/appointments/${appointment._id}`)
                      }
                    >
                      View
                    </button>
                    {!appointment.isCancelled && !appointment.isPaid && (
                      <button
                        className="text-red-600 hover:text-red-900"
                        onClick={() => {
                          setAppointmentToDelete(appointment);
                          setIsDeleteModalOpen(true);
                        }}
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Mobile view for small screens */}
      {appointments.length > 0 && (
        <div className="block sm:hidden">
          {appointments.map((appointment) => (
            <div key={appointment._id} className="bg-white p-4 border-b">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-medium">
                    {appointment.doctorId?.name || "N/A"}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {appointment.doctorId?.speciality || "N/A"}
                  </p>
                </div>
                {getStatusBadge(appointment)}
              </div>
              <div className="text-sm mb-2">
                <p>Patient: {appointment.userId?.name || "N/A"}</p>
                <p>
                  Date: {appointment.date} at {appointment.time}
                </p>
                <p>Payment: {appointment.isPaid ? "Paid" : "Not Paid"}</p>
              </div>
              <div className="flex justify-end space-x-2 mt-2">
                <button
                  className="px-3 py-1 text-xs bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200"
                  onClick={() =>
                    (window.location.href = `/appointments/${appointment._id}`)
                  }
                >
                  View
                </button>
                {!appointment.isCancelled && !appointment.isPaid && (
                  <button
                    className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                    onClick={() => {
                      // Handle cancel appointment
                      if (
                        window.confirm(
                          "Are you sure you want to cancel this appointment?"
                        )
                      ) {
                        // Add your cancel logic here
                      }
                    }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No results */}
      {!loading && appointments.length === 0 && !error && (
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <p className="text-gray-500 mb-2">No appointments found</p>
            <button
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
                setDateFilter("");
                setCurrentPage(1);
                fetchAppointments(1);
              }}
              className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}

      {/* Pagination */}
      {appointments.length > 0 && (
        <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                currentPage === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                currentPage === totalPages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing
                <span className="font-medium">{appointments.length}</span>{" "}
                results of <span className="font-medium">{totalPages * 5}</span>{" "}
                appointments
              </p>
            </div>
            <div>
              <nav
                className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                aria-label="Pagination"
              >
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                    currentPage === 1
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  <span className="sr-only">Previous</span>
                  <ChevronLeft className="h-5 w-5" />
                </button>

                {/* Page numbers */}
                {[...Array(totalPages)].map((_, i) => {
                  const pageNumber = i + 1;
                  // Show current page, first, last, and pages around current
                  if (
                    pageNumber === 1 ||
                    pageNumber === totalPages ||
                    (pageNumber >= currentPage - 1 &&
                      pageNumber <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => handlePageChange(pageNumber)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === pageNumber
                            ? "z-10 bg-indigo-50 border-indigo-500 text-indigo-600"
                            : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  } else if (
                    (pageNumber === currentPage - 2 && currentPage > 3) ||
                    (pageNumber === currentPage + 2 &&
                      currentPage < totalPages - 2)
                  ) {
                    // Show ellipsis
                    return (
                      <span
                        key={pageNumber}
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                      >
                        ...
                      </span>
                    );
                  }
                  return null;
                })}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                    currentPage === totalPages
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  <span className="sr-only">Next</span>
                  <ChevronRight className="h-5 w-5" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Cancel Appointment"
        message="Are you sure you want to Cancel this Appointment?"
        itemName={
          appointmentToDelete
            ? `${appointmentToDelete.userId?.name} - ${appointmentToDelete.doctorId?.name}`
            : "this appointment"
        }
        confirmButtonText="Cancel Appointment"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default DoctorApointments;
