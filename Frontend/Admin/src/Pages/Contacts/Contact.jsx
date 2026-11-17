import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import {
    FaEnvelope,
    FaSyncAlt,
    FaUser,
    FaCalendarAlt,
    FaTrash
} from "react-icons/fa";
import "./Contact.css";
const Contact = () => {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const fetchContacts = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/contacts`,
                {
                    withCredentials: true
                }
            );
            if (response.data.success) {
                setContacts(response.data.contacts || []);
            }
        } catch (error) {
            console.error("GET CONTACTS ERROR:", error);
            alert(
                error.response?.data?.message ||
                "Unable to fetch contact enquiries."
            );
        } finally {
            setLoading(false);
        }
    }, []);
    useEffect(() => {
        fetchContacts();
    }, [fetchContacts]);
    const updateStatus = async (id, status) => {
        try {
            const response = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/api/contacts/${id}/status`,
                { status },
                {
                    withCredentials: true
                }
            );
            if (response.data.success) {
                setContacts((previous) =>
                    previous.map((contact) =>
                        contact._id === id
                            ? response.data.contact
                            : contact
                    )
                );
            }
        } catch (error) {
            console.error("UPDATE CONTACT ERROR:", error);
            alert(
                error.response?.data?.message ||
                "Unable to update contact status."
            );
        }
    };
    const deleteContact = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this enquiry?"
        );
        if (!confirmDelete) return;
        try {
            const response = await axios.delete(
                `${import.meta.env.VITE_BACKEND_URL}/api/contacts/${id}`,
                {
                    withCredentials: true
                }
            );
            if (response.data.success) {
                setContacts((previous) =>
                    previous.filter(
                        (contact) => contact._id !== id
                    )
                );
                alert("Contact enquiry deleted successfully.");
            }
        } catch (error) {
            console.error("DELETE CONTACT ERROR:", error);
            alert(
                error.response?.data?.message ||
                "Unable to delete contact enquiry."
            );
        }
    };
    const formatDate = (date) => {
        if (!date) return "-";
        return new Date(date).toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );
    };
    const totalContacts = contacts.length;
    const unreadCount = contacts.filter(
        (contact) => contact.status === "Unread"
    ).length;
    const readCount = contacts.filter(
        (contact) => contact.status === "Read"
    ).length;
    const handledCount = contacts.filter(
        (contact) => contact.status === "Handled"
    ).length;
    return (
        <main className="admin-contact-page">
            {/* HEADER */}
            <div className="admin-contact-header">
                <div className="contact-header-left">
                    <div className="contact-header-icon">
                        <FaEnvelope />
                    </div>
                    <div>
                        <h1>Contact Enquiries</h1>
                        <p>
                            Manage messages received from Beautique customers.
                        </p>
                    </div>
                </div>
                <button
                    className="refresh-contact-btn"
                    onClick={fetchContacts}
                    disabled={loading}
                >
                    <FaSyncAlt />
                    Refresh
                </button>
            </div>
            {/* SUMMARY CARDS */}
            <div className="contact-summary">
                <div className="contact-summary-card total-card">
                    <div className="summary-icon">
                        <FaEnvelope />
                    </div>
                    <div className="summary-info">
                        <span>Total Enquiries</span>
                        <strong>{totalContacts}</strong>
                    </div>
                </div>
                <div className="contact-summary-card unread-card">
                    <div className="summary-icon">
                        <FaEnvelope />
                    </div>
                    <div className="summary-info">
                        <span>Unread</span>
                        <strong>{unreadCount}</strong>
                    </div>
                </div>
                <div className="contact-summary-card read-card">
                    <div className="summary-icon">
                        <FaEnvelope />
                    </div>
                    <div className="summary-info">
                        <span>Read</span>
                        <strong>{readCount}</strong>
                    </div>
                </div>
                <div className="contact-summary-card handled-card">
                    <div className="summary-icon">
                        <FaEnvelope />
                    </div>
                    <div className="summary-info">
                        <span>Handled</span>
                        <strong>{handledCount}</strong>
                    </div>
                </div>
            </div>
            {/* LOADING */}
            {loading ? (
                <div className="contact-message-box">
                    <div className="contact-loader"></div>
                    <h3>Loading Contact Enquiries...</h3>
                    <p>Please wait while we load customer messages.</p>
                </div>
            ) : contacts.length === 0 ? (
                <div className="contact-empty-box">
                    <div className="empty-envelope">
                        <FaEnvelope />
                    </div>
                    <h2>No Contact Enquiries</h2>
                    <p>
                        No customer messages have been received yet.
                    </p>
                    <button onClick={fetchContacts}>
                        <FaSyncAlt />
                        Refresh
                    </button>
                </div>
            ) : (
                <div className="contact-table-container">
                    <div className="table-title">
                        <div>
                            <h2>Customer Messages</h2>
                            <p>
                                View and manage customer contact enquiries
                            </p>
                        </div>
                        <span className="enquiry-count">
                            {totalContacts} Enquiries
                        </span>
                    </div>
                    <div className="contact-table-wrapper">
                        <table className="contact-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>
                                        <FaUser /> Customer
                                    </th>
                                    <th>Email</th>
                                    <th>Message</th>
                                    <th>
                                        <FaCalendarAlt /> Date
                                    </th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {contacts.map((contact, index) => (
                                    <tr key={contact._id}>
                                        {/* NUMBER */}
                                        <td>
                                            <span className="contact-number">
                                                {index + 1}
                                            </span>
                                        </td>
                                        {/* CUSTOMER */}
                                        <td>
                                            <div className="customer-info">
                                                <div className="customer-avatar">
                                                    {contact.name
                                                        ? contact.name.charAt(0).toUpperCase()
                                                        : "U"}
                                                </div>
                                                <div>
                                                    <div className="customer-name">
                                                        {contact.name}
                                                    </div>
                                                    <small>Customer</small>
                                                </div>
                                            </div>
                                        </td>
                                        {/* EMAIL */}
                                        <td>
                                            <a
                                                className="customer-email"
                                                href={`mailto:${contact.email}`}
                                            >
                                                {contact.email}
                                            </a>
                                        </td>
                                        {/* MESSAGE */}
                                        <td>
                                            <div className="customer-message">
                                                {contact.message}
                                            </div>
                                        </td>
                                        {/* DATE */}
                                        <td>
                                            <div className="contact-date">
                                                <FaCalendarAlt />
                                                {formatDate(contact.createdAt)}
                                            </div>
                                        </td>
                                        {/* STATUS */}
                                        <td>
                                            <select
                                                value={contact.status || "Unread"}
                                                onChange={(e) =>
                                                    updateStatus(
                                                        contact._id,
                                                        e.target.value
                                                    )
                                                }
                                                className={`contact-status-select status-${(
                                                    contact.status || "Unread"
                                                ).toLowerCase()}`}
                                            >
                                                <option value="Unread">
                                                    Unread
                                                </option>
                                                <option value="Read">
                                                    Read
                                                </option>
                                                <option value="Handled">
                                                    Handled
                                                </option>
                                            </select>
                                        </td>
                                        {/* DELETE */}
                                        <td>
                                            <button
                                                className="delete-contact-btn"
                                                onClick={() =>
                                                    deleteContact(contact._id)
                                                }
                                                title="Delete Enquiry"
                                            >
                                                <FaTrash />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </main>
    );
};
export default Contact;
