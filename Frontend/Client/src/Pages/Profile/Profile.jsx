import { useEffect, useState } from "react";
import axios from "axios";
import "./Profile.css";
import {
    FaUser,
    FaEnvelope,
    FaPhone,
    FaEdit
} from "react-icons/fa";
const Profile = () => {
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: ""
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const API = import.meta.env.VITE_BACKEND_URL;
    const fetchProfile = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `${API}/api/auth/profile`,
                { withCredentials: true }
            );
            if (response.data.success) {
                const userData = response.data.user;
                setUser(userData);
                setFormData({
                    name: userData.name || "",
                    email: userData.email || "",
                    phone: userData.phone || ""
                });
            }
        } catch (err) {
            console.log("Profile Error:", err.response?.data || err.message);
            setError("Unable to load profile.");
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchProfile();
    }, []);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };
    const handleEdit = () => {
        setMessage("");
        setError("");
        setIsEditing(true);
    };
    const handleCancel = () => {
        setFormData({
            name: user.name || "",
            email: user.email || "",
            phone: user.phone || ""
        });
        setIsEditing(false);
        setError("");
        setMessage("");
    };
    const handleSave = async () => {
        if (!formData.name.trim()) {
            setError("Name is required.");
            return;
        }
        if (!formData.phone.trim()) {
            setError("Phone number is required.");
            return;
        }
        try {
            setSaving(true);
            setError("");
            setMessage("");
            const response = await axios.put(
                `${API}/api/auth/update-profile`,
                {
                    name: formData.name,
                    phone: formData.phone
                },
                {
                    withCredentials: true
                }
            );
            if (response.data.success) {
                setUser(response.data.user);
                setFormData({
                    name: response.data.user.name || "",
                    email: response.data.user.email || "",
                    phone: response.data.user.phone || ""
                });
                setIsEditing(false);
                setMessage("Profile updated successfully!");
            }
        } catch (err) {
            console.log(
                "Update Profile Error:",
                err.response?.data || err.message
            );
            setError(
                err.response?.data?.message ||
                "Profile update failed."
            );
        } finally {
            setSaving(false);
        }
    };
    if (loading) {
        return <div className="profile-loading">Loading Profile...</div>;
    }
    if (error && !user) {
        return <div className="profile-error">{error}</div>;
    }
    if (!user) {
        return <div className="profile-error">User not found.</div>;
    }
    return (
        <div className="profile-page">
            <div className="profile-container">
                <div className="profile-heading">
                    <h1>My Profile</h1>
                    <p>Manage your personal information</p>
                </div>
                <div className="profile-content">
                    <div className="profile-sidebar">
                        <div className="profile-avatar">
                            {user.profileImage ? (
                                <img
                                    src={user.profileImage}
                                    alt="Profile"
                                />
                            ) : (
                                <FaUser />
                            )}
                        </div>
                        <h2>{formData.name}</h2>
                        <p>{user.email}</p>
                        <div className="profile-badge">
                            Beautique Member
                        </div>
                    </div>
                    <div className="profile-details">
                        <div className="profile-details-header">
                            <div>
                                <h2>Personal Information</h2>
                                <p>Update your personal details</p>
                            </div>
                            {!isEditing && (
                                <button
                                    className="edit-profile-btn"
                                    onClick={handleEdit}
                                >
                                    <FaEdit />
                                    Edit Profile
                                </button>
                            )}
                        </div>
                        {message && (
                            <p className="profile-success">{message}</p>
                        )}
                        {error && (
                            <p className="profile-error">{error}</p>
                        )}
                        <div className="profile-form">
                            <div className="profile-input-group">
                                <label>Full Name</label>
                                <div className="profile-input">
                                    <FaUser />
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                    />
                                </div>
                            </div>
                            <div className="profile-input-group">
                                <label>Email Address</label>
                                <div className="profile-input">
                                    <FaEnvelope />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        disabled
                                    />
                                </div>
                            </div>
                            <div className="profile-input-group">
                                <label>Phone Number</label>
                                <div className="profile-input">
                                    <FaPhone />
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                    />
                                </div>
                            </div>
                        </div>
                        {isEditing && (
                            <div className="profile-actions">
                                <button
                                    className="cancel-btn"
                                    onClick={handleCancel}
                                    disabled={saving}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="save-profile-btn"
                                    onClick={handleSave}
                                    disabled={saving}
                                >
                                    {saving ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Profile;
