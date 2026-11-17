import { useCallback, useEffect, useState } from "react";
import {
  FaCalendarAlt,
  FaClock,
  FaEnvelope,
  FaPhone,
  FaTrash,
  FaUser,
  FaSyncAlt,
} from "react-icons/fa";
import {
  FaEye,
  FaTimes
} from "react-icons/fa";
import axios from "axios"
import "./Appointments.css";
function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);
  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/appointments/getAllAppointment`,
        {
          withCredentials: true,
        }
      );
      if (response.data.success) {
        setAppointments(response.data.appointments || []);
      }
    } catch (error) {
      console.error("Get Appointments Error:", error);
      alert(
        error.response?.data?.message ||
        "Failed to load appointments."
      );
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);
  const viewAppointment = async (id) => {
    try {
      setViewLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/appointments/${id}`,
        {
          withCredentials: true
        }
      );
      if (response.data.success) {
        setSelectedAppointment(response.data.appointment);
      }
    } catch (error) {
      console.error("View Appointment Error:", error);
      alert(
        error.response?.data?.message ||
        "Unable to fetch appointment."
      );
    } finally {
      setViewLoading(false);
    }
  };
  const updateStatus = async (id, status) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/appointments/${id}/status`,
        { status },
        {
          withCredentials: true
        }
      );
      if (response.data.success) {
        setAppointments((prev) =>
          prev.map((appointment) =>
            appointment._id === id
              ? response.data.appointment
              : appointment
          )
        );
        alert("Appointment status updated successfully.");
      }
    } catch (error) {
      console.error("Update Appointment Error:", error);
      alert(
        error.response?.data?.message ||
        "Unable to update appointment."
      );
    }
  };
  const deleteAppointment = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this appointment?"
    );
    if (!confirmDelete) return;
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/appointments/deleteAppointment/${id}`,
        {
          withCredentials: true
        }
      );
      if (response.data.success) {
        setAppointments((prev) =>
          prev.filter(
            (appointment) => appointment._id !== id
          )
        );
        if (selectedAppointment?._id === id) {
          setSelectedAppointment(null);
        }
      }
    } catch (error) {
      console.error("Delete Appointment Error:", error);
      alert(
        error.response?.data?.message ||
        "Unable to delete appointment."
      );
    }
  };
  const formatDate = (date) => {
    if (!date) {
      return "-";
    }
    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };
  const getStatusClass = (status) => {
    switch (status) {
      case "Pending":
        return "status-pending";
      case "Confirmed":
        return "status-confirmed";
      case "Completed":
        return "status-completed";
      case "Cancelled":
        return "status-cancelled";
      default:
        return "";
    }
  };
  return (
    <div className="admin-appointments-layout">
      {/* =====================================
          MAIN CONTENT
      ===================================== */}
      <main className="admin-appointments-page">
        {/* HEADER */}
        <div className="appointments-header">
          <div>
            <p className="appointments-small-title">
              BEAUTIQUE ADMIN PANEL
            </p>
            <h1>
              Appointments
            </h1>
            <p className="appointments-subtitle">
              Manage and track all customer
              appointments.
            </p>
          </div>
          <button
            className="refresh-appointments-btn"
            onClick={fetchAppointments}
          >
            <FaSyncAlt />
            Refresh
          </button>
        </div>
        {/* SUMMARY */}
        <div className="appointments-summary">
          <div className="appointment-count-box">
            <FaCalendarAlt />
            <div>
              <span>
                Total Appointments
              </span>
              <strong>
                {appointments.length}
              </strong>
            </div>
          </div>
        </div>
        {/* LOADING */}
        {loading ? (
          <div className="appointments-loading">
            Loading appointments...
          </div>
        ) : appointments.length === 0 ? (
          <div className="no-appointments">
            <FaCalendarAlt />
            <h3>
              No Appointments Found
            </h3>
            <p>
              Customer appointments will
              appear here after they book
              a service.
            </p>
          </div>
        ) : (
          <div className="appointments-table-container">
            <table className="appointments-table">
              <thead>
                <tr>
                  <th>
                    Customer
                  </th>
                  <th>
                    Contact
                  </th>
                  <th>
                    Service
                  </th>
                  <th>
                    Date
                  </th>
                  <th>
                    Time
                  </th>
                  <th>
                    Status
                  </th>
                  <th>
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {appointments.map(
                  (appointment) => (
                    <tr
                      key={
                        appointment._id
                      }
                    >
                      {/* CUSTOMER */}
                      <td>
                        <div className="customer-name">
                          <div className="customer-icon">
                            <FaUser />
                          </div>
                          <div>
                            <strong>
                              {
                                appointment.name
                              }
                            </strong>
                            <span>
                              Appointment
                            </span>
                          </div>
                        </div>
                      </td>
                      {/* CONTACT */}
                      <td>
                        <div className="contact-info">
                          <span>
                            <FaEnvelope />
                            {
                              appointment.email
                            }
                          </span>
                          <span>
                            <FaPhone />
                            {
                              appointment.phone
                            }
                          </span>
                        </div>
                      </td>
                      {/* SERVICE */}
                      <td>
                        <span className="service-name">
                          {
                            appointment.service
                          }
                        </span>
                      </td>
                      {/* DATE */}
                      <td>
                        <span className="date-info">
                          <FaCalendarAlt />
                          {
                            formatDate(
                              appointment.date
                            )
                          }
                        </span>
                      </td>
                      {/* TIME */}
                      <td>
                        <span className="time-info">
                          <FaClock />
                          {
                            appointment.time
                          }
                        </span>
                      </td>
                      {/* STATUS */}
                      <td>
                        <select
                          value={
                            appointment.status
                          }
                          className={`appointment-status-select ${getStatusClass(
                            appointment.status
                          )}`}
                          onChange={(e) =>
                            updateStatus(
                              appointment._id,
                              e.target.value
                            )
                          }
                        >
                          <option value="Pending">
                            Pending
                          </option>
                          <option value="Confirmed">
                            Confirmed
                          </option>
                          <option value="Completed">
                            Completed
                          </option>
                          <option value="Cancelled">
                            Cancelled
                          </option>
                        </select>
                      </td>
                      <td>
                        <div className="appointment-action-buttons">
                          {/* VIEW BUTTON */}
                          <button
                            className="view-appointment-btn"
                            onClick={() => viewAppointment(appointment._id)}
                            title="View Appointment"
                          >
                            <FaEye />
                          </button>
                          {/* DELETE BUTTON */}
                          <button
                            className="delete-appointment-btn"
                            onClick={() => deleteAppointment(appointment._id)}
                            title="Delete Appointment"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
        {selectedAppointment && (
          <div className="appointment-modal-overlay">
            <div className="appointment-modal">
              <div className="appointment-modal-header">
                <div>
                  <h2>Appointment Details</h2>
                  <p>Complete customer appointment information</p>
                </div>
                <button
                  className="close-appointment-modal"
                  onClick={() => setSelectedAppointment(null)}
                >
                  <FaTimes />
                </button>
              </div>
              <div className="appointment-modal-body">
                <div className="appointment-detail-item">
                  <span>Customer Name</span>
                  <strong>{selectedAppointment.name || "-"}</strong>
                </div>
                <div className="appointment-detail-item">
                  <span>Email Address</span>
                  <strong>{selectedAppointment.email || "-"}</strong>
                </div>
                <div className="appointment-detail-item">
                  <span>Phone Number</span>
                  <strong>{selectedAppointment.phone || "-"}</strong>
                </div>
                <div className="appointment-detail-item">
                  <span>Service</span>
                  <strong>{selectedAppointment.service || "-"}</strong>
                </div>
                <div className="appointment-detail-item">
                  <span>Appointment Date</span>
                  <strong>{formatDate(selectedAppointment.date)}</strong>
                </div>
                <div className="appointment-detail-item">
                  <span>Appointment Time</span>
                  <strong>{selectedAppointment.time || "-"}</strong>
                </div>
                <div className="appointment-detail-item">
                  <span>Status</span>
                  <strong>{selectedAppointment.status || "-"}</strong>
                </div>
                <div className="appointment-detail-item">
                  <span>Appointment ID</span>
                  <strong>{selectedAppointment._id}</strong>
                </div>
              </div>
              <button
                className="close-modal-bottom-btn"
                onClick={() => setSelectedAppointment(null)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
export default AdminAppointments;