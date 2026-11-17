import { useEffect, useState } from "react";
import axios from "axios";
import { FaCalendarAlt, FaClock, FaSpa, FaTimesCircle } from "react-icons/fa";
import "./MyAppointments.css";
function MyAppointments() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const fetchAppointments = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/appointments/my`,
                {
                    withCredentials: true
                }
            );
            if (response.data.success) {
                setAppointments(response.data.appointments);
            }
        } catch (error) {
            console.log(
                "My Appointments Error:",
                error.response?.data || error.message
            );
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchAppointments();
    }, []);
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "long",
            year: "numeric"
        });
    };
    return (
        <div className="my-appointments-page">
            <div className="appointments-hero">
                <span>BEAUTIQUE COSMETICS</span>
                <h1>My Appointments</h1>
                <p>
                    Your beauty journey, organized in one place.
                </p>
            </div>
            <div className="appointments-container">
                <div className="appointments-heading">
                    <div>
                        <h2>Your Bookings</h2>
                        <p>Manage and track your appointments</p>
                    </div>
                    <span className="appointment-count">
                        {appointments.length} Bookings
                    </span>
                </div>
                {loading ? (
                    <div className="appointment-message">
                        Loading appointments...
                    </div>
                ) : appointments.length === 0 ? (
                    <div className="appointment-empty">
                        <FaCalendarAlt />
                        <h3>No Appointments Yet</h3>
                        <p>
                            You haven't booked any beauty services yet.
                        </p>
                    </div>
                ) : (
                    <div className="appointments-grid">
                        {appointments.map((appointment) => (
                            <div
                                className="appointment-card"
                                key={appointment._id}
                            >
                                <div className="appointment-card-top">
                                    <div className="appointment-service-icon">
                                        <FaSpa />
                                    </div>
                                    <span
                                        className={`appointment-status ${appointment.status?.toLowerCase()}`}
                                    >
                                        {appointment.status}
                                    </span>
                                </div>
                                <h3>{appointment.service}</h3>
                                <div className="appointment-info">
                                    <p>
                                        <FaCalendarAlt />
                                        {formatDate(appointment.date)}
                                    </p>
                                    <p>
                                        <FaClock />
                                        {appointment.time}
                                    </p>
                                </div>
                                <div className="appointment-divider"></div>
                                <div className="appointment-customer">
                                    <div>
                                        <span>Customer Name</span>
                                        <h4>{appointment.name}</h4>
                                    </div>
                                    <div>
                                        <span>Booking Status</span>
                                        <h4>{appointment.status}</h4>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
export default MyAppointments;
