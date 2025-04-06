import React, { useState, useEffect,useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Printer,
  Loader,
} from "lucide-react";
import { AdminContext } from "../../context/AdminContext";

const AppointmentDetails = () => {
  const { id } = useParams();  
  const navigate = useNavigate();
  const{backendUrl} = useContext(AdminContext)
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppointmentDetails = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${backendUrl}/api/appointment/${id}`);
        if (data.success) {
          setAppointment(data.appointment);
        } else {
          setError(data.message || "Failed to fetch appointment details");
        }
      } catch (error) {
        console.error("Error fetching appointment details:", error);
        setError(
          error.response?.data?.message || "Failed to fetch appointment details"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAppointmentDetails();
  }, [id]);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleCancelAppointment = async () => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) {
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.put(`/api/appointments/${id}/cancel`);
      if (data.success) {
        setAppointment({ ...appointment, isCancelled: true });
        alert("Appointment cancelled successfully");
      } else {
        alert(data.message || "Failed to cancel appointment");
      }
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      alert(error.response?.data?.message || "Failed to cancel appointment");
    } finally {
      setLoading(false);
    }
  };

  const handlePrintAppointment = () => {
    window.print();
  };

  if (loading && !appointment) {
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
            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Error Loading Appointment
            </h2>
            <p className="text-gray-600 mb-6">{error}</p>
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

  if (!appointment) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6">
          <div className="text-center py-10">
            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Appointment Not Found
            </h2>
            <p className="text-gray-600 mb-6">
              The appointment you're looking for doesn't exist or has been
              removed.
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

  const getStatusBadge = () => {
    if (appointment.isCancelled) {
      return (
        <span className="px-3 py-1 text-sm font-medium rounded-full bg-red-100 text-red-800">
          Cancelled
        </span>
      );
    } else if (appointment.isPaid) {
      return (
        <span className="px-3 py-1 text-sm font-medium rounded-full bg-green-100 text-green-800">
          Confirmed & Paid
        </span>
      );
    } else {
      return (
        <span className="px-3 py-1 text-sm font-medium rounded-full bg-yellow-100 text-yellow-800">
          Pending Payment
        </span>
      );
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header with back button */}
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-indigo-600 hover:text-indigo-800"
          >
            <ArrowLeft className="h-5 w-5 mr-1" />
            <span>Back to Appointments</span>
          </button>
          <div className="ml-auto print:hidden">
            <button
              onClick={handlePrintAppointment}
              className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            >
              <Printer className="h-4 w-4 mr-2" />
              Print
            </button>
          </div>
        </div>

        {/* Appointment Status Banner */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
          <div className="p-6 border-b">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Appointment Details
                </h1>
                <p className="text-gray-500">
                  Appointment ID: {appointment._id}
                </p>
              </div>
              <div className="mt-4 sm:mt-0">{getStatusBadge()}</div>
            </div>
          </div>

          {/* Appointment Date and Time */}
          <div className="p-6 bg-indigo-50 border-b">
            <div className="flex flex-col md:flex-row md:items-center">
              <div className="flex items-center mb-4 md:mb-0 md:mr-8">
                <Calendar className="h-5 w-5 text-indigo-600 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium">{appointment.date}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-indigo-600 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Time</p>
                  <p className="font-medium">{appointment.time}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Doctor Information */}
          <div className="p-6 border-b">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Doctor Information
            </h2>
            <div className="flex flex-col sm:flex-row">
              <div className="sm:w-1/4 mb-4 sm:mb-0">
                {appointment.doctorId?.image?.url ? (
                  <img
                    src={appointment.doctorId.image.url || "/placeholder.svg"}
                    alt={appointment.doctorId.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500">No Image</span>
                  </div>
                )}
              </div>
              <div className="sm:w-3/4">
                <h3 className="text-xl font-medium text-gray-900">
                  {appointment.doctorId?.name || "N/A"}
                </h3>
                <p className="text-gray-600 mb-2">
                  {appointment.doctorId?.speciality || "N/A"}
                </p>

                {appointment.doctorId?.address && (
                  <div className="flex items-start mt-3">
                    <MapPin className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                    <div>
                      <p className="text-gray-600">
                        {appointment.doctorId.address.line1}
                      </p>
                      <p className="text-gray-600">
                        {appointment.doctorId.address.line2}
                      </p>
                      {appointment.doctorId.address.city && (
                        <p className="text-gray-600">
                          {appointment.doctorId.address.city},
                          {appointment.doctorId.address.state}
                          {appointment.doctorId.address.zipCode}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Patient Information */}
          <div className="p-6 border-b">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Patient Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-500 text-sm">Name</p>
                <p className="font-medium">
                  {appointment.userId?.name || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-gray-500 text-sm">Email</p>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 text-gray-400 mr-1" />
                  <p>{appointment.userId?.email || "N/A"}</p>
                </div>
              </div>

              {appointment.userId?.phone && (
                <div>
                  <p className="text-gray-500 text-sm">Phone</p>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 text-gray-400 mr-1" />
                    <p>{appointment.userId.phone}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Payment Information */}
          <div className="p-6 border-b">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Payment Information
            </h2>
            {appointment.isPaid ? (
              <div className="bg-green-50 border border-green-200 rounded-md p-4">
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <div>
                    <p className="font-medium text-green-700">
                      Payment Completed
                    </p>
                    {appointment.paidAt && (
                      <p className="text-green-600 text-sm">
                        Paid on {formatDate(appointment.paidAt)}
                      </p>
                    )}
                    {appointment.paymentId && (
                      <p className="text-gray-600 text-sm mt-1">
                        Payment ID: {appointment.paymentId}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                <div className="flex items-start">
                  <CreditCard className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
                  <div>
                    <p className="font-medium text-yellow-700">
                      Payment Pending
                    </p>
                    <p className="text-gray-600 text-sm">
                      This appointment requires payment to be confirmed.
                    </p>

                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Additional Information */}
          {appointment.notes && (
            <div className="p-6 border-b">
              <h2 className="text-lg font-medium text-gray-900 mb-2">Notes</h2>
              <p className="text-gray-600">{appointment.notes}</p>
            </div>
          )}

          {/* Actions */}
          {!appointment.isCancelled && (
            <div className="p-6 print:hidden">
              <div className="flex flex-wrap gap-3">
                {!appointment.isPaid && (
                  <button
                    onClick={handleCancelAppointment}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    disabled={loading}
                  >
                    {loading ? "Processing..." : "Cancel Appointment"}
                  </button>
                )}

                <button
                  onClick={() =>
                    navigate(`/appointments/reschedule/${appointment._id}`)
                  }
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
                >
                  Reschedule
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Cancellation Information */}
        {appointment.isCancelled && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-start">
              <XCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
              <div>
                <h3 className="font-medium text-red-700">
                  Appointment Cancelled
                </h3>
                {appointment.cancelledAt && (
                  <p className="text-gray-600 text-sm">
                    Cancelled on {formatDate(appointment.cancelledAt)}
                  </p>
                )}
                {appointment.cancellationReason && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Reason for cancellation:
                    </p>
                    <p className="text-gray-700">
                      {appointment.cancellationReason}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentDetails;
