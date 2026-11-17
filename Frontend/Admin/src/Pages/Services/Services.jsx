import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
    FaPlus,
    FaEdit,
    FaTrash,
    FaTimes,
    FaSearch,
    FaSpa,
    FaStar,
} from "react-icons/fa";
import "./Services.css";
const API_URL = import.meta.env.VITE_BACKEND_URL;
const initialForm = {
    title: "",
    category: "",
    icon: "FaMagic",
    shortDescription: "",
    description: "",
    duration: "",
    startingPrice: "",
    experience: "",
    benefits: [""],
    status: true,
    featured: false,
    displayOrder: 0,
};
const Services = () => {
    const navigate = useNavigate();
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedService, setSelectedService] = useState(null);
    const [formData, setFormData] = useState(initialForm);
    const [submitting, setSubmitting] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [serviceToDelete, setServiceToDelete] = useState(null);
    const fetchServices = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `${API_URL}/api/services/all`,
                {
                    withCredentials: true,
                }
            );
            if (response.data.success) {
                setServices(response.data.services || []);
            }
        } catch (error) {
            console.log(
                "Fetch Services Error:",
                error.response?.data || error.message
            );
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchServices();
    }, []);
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };
    const handleBenefitChange = (index, value) => {
        const updatedBenefits = [...formData.benefits];
        updatedBenefits[index] = value;
        setFormData((prev) => ({
            ...prev,
            benefits: updatedBenefits,
        }));
    };
    const addBenefit = () => {
        setFormData((prev) => ({
            ...prev,
            benefits: [...prev.benefits, ""],
        }));
    };
    const removeBenefit = (index) => {
        setFormData((prev) => ({
            ...prev,
            benefits:
                prev.benefits.length === 1
                    ? [""]
                    : prev.benefits.filter((_, i) => i !== index),
        }));
    };
    const openEditModal = (service) => {
        setSelectedService(service);
        setFormData({
            title: service.title || "",
            category: service.category || "",
            icon: service.icon || "FaMagic",
            shortDescription: service.shortDescription || "",
            description: service.description || "",
            duration: service.duration || "",
            startingPrice: service.startingPrice ?? "",
            experience: service.experience || "",
            benefits: service.benefits?.length
                ? service.benefits
                : [""],
            status: service.status ?? true,
            featured: service.featured ?? false,
            displayOrder: service.displayOrder ?? 0,
        });
        setIsModalOpen(true);
    };
    const closeModal = () => {
        if (submitting) return;
        setIsModalOpen(false);
        setSelectedService(null);
        setFormData(initialForm);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const cleanedBenefits = formData.benefits
            .map((benefit) => benefit.trim())
            .filter(Boolean);
        if (cleanedBenefits.length === 0) {
            alert("Please add at least one benefit.");
            return;
        }
        try {
            setSubmitting(true);
            const payload = {
                ...formData,
                startingPrice: Number(formData.startingPrice),
                displayOrder: Number(formData.displayOrder),
                benefits: cleanedBenefits,
            };
            const response = await axios.put(
                `${API_URL}/api/services/update/${selectedService._id}`,
                payload,
                {
                    withCredentials: true,
                }
            );
            if (response.data.success) {
                alert(response.data.message);
                setIsModalOpen(false);
                setFormData(initialForm);
                setSelectedService(null);
                await fetchServices();
            }
        } catch (error) {
            console.log(
                "Update Service Error:",
                error.response?.data || error.message
            );
            alert(
                error.response?.data?.message ||
                "Unable to update service."
            );
        } finally {
            setSubmitting(false);
        }
    };
    const openDeleteModal = (service) => {
        setServiceToDelete(service);
        setDeleteModal(true);
    };
    const closeDeleteModal = () => {
        setDeleteModal(false);
        setServiceToDelete(null);
    };
    const handleDelete = async () => {
        if (!serviceToDelete) return;
        try {
            const response = await axios.delete(
                `${API_URL}/api/services/delete/${serviceToDelete._id}`,
                {
                    withCredentials: true,
                }
            );
            if (response.data.success) {
                alert(response.data.message);
                closeDeleteModal();
                await fetchServices();
            }
        } catch (error) {
            console.log(
                "Delete Service Error:",
                error.response?.data || error.message
            );
            alert(
                error.response?.data?.message ||
                "Unable to delete service."
            );
        }
    };
    const filteredServices = services.filter((service) => {
        const value = search.toLowerCase();
        return (
            service.title?.toLowerCase().includes(value) ||
            service.category?.toLowerCase().includes(value)
        );
    });
    return (
        <div className="services-admin-page">
            <div className="services-page-header">
                <div>
                    <p className="services-page-subtitle">
                        BEAUTIQUE MANAGEMENT
                    </p>
                    <h1>Services Management</h1>
                    <p className="services-page-description">
                        Manage your beauty services, pricing and details.
                    </p>
                </div>
                <button
                    className="service-add-btn"
                    onClick={() => navigate("/add-service")}
                >
                    <FaPlus />
                    Add New Service
                </button>
            </div>
            <div className="services-stats">
                <div className="service-stat-card">
                    <div className="service-stat-icon">
                        <FaSpa />
                    </div>
                    <div>
                        <p>Total Services</p>
                        <h2>{services.length}</h2>
                    </div>
                </div>
                <div className="service-stat-card">
                    <div className="service-stat-icon active">
                        <FaStar />
                    </div>
                    <div>
                        <p>Active Services</p>
                        <h2>
                            {services.filter((item) => item.status).length}
                        </h2>
                    </div>
                </div>
                <div className="service-stat-card">
                    <div className="service-stat-icon inactive">
                        <FaSpa />
                    </div>
                    <div>
                        <p>Inactive Services</p>
                        <h2>
                            {services.filter((item) => !item.status).length}
                        </h2>
                    </div>
                </div>
            </div>
            <div className="services-table-container">
                <div className="services-table-header">
                    <div>
                        <h2>All Services</h2>
                        <p>View and manage all your services</p>
                    </div>
                    <div className="services-search-box">
                        <FaSearch />
                        <input
                            type="text"
                            placeholder="Search services..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
                {loading ? (
                    <div className="services-loading">
                        Loading services...
                    </div>
                ) : filteredServices.length === 0 ? (
                    <div className="services-empty">
                        <FaSpa />
                        <h3>No Services Found</h3>
                        <p>Add your first beauty service to get started.</p>
                    </div>
                ) : (
                    <div className="services-table-scroll">
                        <table className="services-table">
                            <thead>
                                <tr>
                                    <th>Service</th>
                                    <th>Category</th>
                                    <th>Duration</th>
                                    <th>Starting Price</th>
                                    <th>Status</th>
                                    <th>Featured</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredServices.map((service) => (
                                    <tr key={service._id}>
                                        <td>
                                            <div className="service-table-name">
                                                <div className="service-table-icon">
                                                    <FaSpa />
                                                </div>
                                                <div>
                                                    <h4>{service.title}</h4>
                                                    <p>{service.shortDescription}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td>{service.category}</td>
                                        <td>{service.duration}</td>
                                        <td>
                                            ₹{Number(service.startingPrice).toLocaleString("en-IN")}
                                        </td>
                                        <td>
                                            <span
                                                className={
                                                    service.status
                                                        ? "service-status active"
                                                        : "service-status inactive"
                                                }
                                            >
                                                {service.status ? "Active" : "Inactive"}
                                            </span>
                                        </td>
                                        <td>
                                            <span
                                                className={
                                                    service.featured
                                                        ? "service-featured yes"
                                                        : "service-featured no"
                                                }
                                            >
                                                {service.featured ? "Yes" : "No"}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="service-action-buttons">
                                                <button
                                                    className="service-edit-btn"
                                                    title="Edit Service"
                                                    onClick={() => openEditModal(service)}
                                                >
                                                    <FaEdit />
                                                </button>
                                                <button
                                                    className="service-delete-btn"
                                                    title="Delete Service"
                                                    onClick={() => openDeleteModal(service)}
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            {isModalOpen && (
                <div
                    className="service-modal-overlay"
                    onClick={closeModal}
                >
                    <div
                        className="service-modal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="service-modal-header">
                            <div>
                                <p>BEAUTIQUE</p>
                                <h2>Update Service</h2>
                            </div>
                            <button
                                type="button"
                                onClick={closeModal}
                                disabled={submitting}
                            >
                                <FaTimes />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="service-form-grid">
                                <div className="service-form-group">
                                    <label>Service Title *</label>
                                    <input
                                        type="text"
                                        name="title"
                                        placeholder="Enter service title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="service-form-group">
                                    <label>Category *</label>
                                    <input
                                        type="text"
                                        name="category"
                                        placeholder="e.g. Makeup"
                                        value={formData.category}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="service-form-group">
                                    <label>Choose Service Icon *</label>
                                    <select
                                        name="icon"
                                        value={formData.icon}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="FaMagic">Magic</option>
                                        <option value="FaHeart">Heart</option>
                                        <option value="FaCut">Hair Care</option>
                                        <option value="FaGem">Gem</option>
                                        <option value="FaStar">Star</option>
                                        <option value="FaCrown">Crown</option>
                                    </select>
                                </div>
                                <div className="service-form-group">
                                    <label>Duration *</label>
                                    <input
                                        type="text"
                                        name="duration"
                                        placeholder="e.g. 45–60 Minutes"
                                        value={formData.duration}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="service-form-group">
                                    <label>Starting Price (₹) *</label>
                                    <input
                                        type="number"
                                        name="startingPrice"
                                        placeholder="Enter price"
                                        min="0"
                                        value={formData.startingPrice}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="service-form-group">
                                    <label>Experience *</label>
                                    <input
                                        type="text"
                                        name="experience"
                                        placeholder="e.g. Professional"
                                        value={formData.experience}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="service-form-group full">
                                    <label>Short Description *</label>
                                    <textarea
                                        name="shortDescription"
                                        placeholder="Enter short description"
                                        value={formData.shortDescription}
                                        onChange={handleChange}
                                        rows="2"
                                        required
                                    />
                                </div>
                                <div className="service-form-group full">
                                    <label>Full Description *</label>
                                    <textarea
                                        name="description"
                                        placeholder="Enter complete service description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows="4"
                                        required
                                    />
                                </div>
                                <div className="service-form-group full">
                                    <div className="service-benefits-heading">
                                        <label>What You Get / Benefits *</label>
                                        <button
                                            type="button"
                                            onClick={addBenefit}
                                        >
                                            <FaPlus /> Add Benefit
                                        </button>
                                    </div>
                                    {formData.benefits.map((benefit, index) => (
                                        <div
                                            className="service-benefit-input"
                                            key={index}
                                        >
                                            <input
                                                type="text"
                                                placeholder={`Benefit ${index + 1}`}
                                                value={benefit}
                                                onChange={(e) =>
                                                    handleBenefitChange(index, e.target.value)
                                                }
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeBenefit(index)}
                                            >
                                                <FaTimes />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <div className="service-form-group">
                                    <label>Display Order</label>
                                    <input
                                        type="number"
                                        name="displayOrder"
                                        min="0"
                                        value={formData.displayOrder}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="service-checkbox-group">
                                    <label>
                                        <input
                                            type="checkbox"
                                            name="status"
                                            checked={formData.status}
                                            onChange={handleChange}
                                        />
                                        Active Service
                                    </label>
                                    <label>
                                        <input
                                            type="checkbox"
                                            name="featured"
                                            checked={formData.featured}
                                            onChange={handleChange}
                                        />
                                        Featured Service
                                    </label>
                                </div>
                            </div>
                            <div className="service-modal-footer">
                                <button
                                    type="button"
                                    className="service-cancel-btn"
                                    onClick={closeModal}
                                    disabled={submitting}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="service-submit-btn"
                                    disabled={submitting}
                                >
                                    {submitting ? "Updating..." : "Update Service"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {deleteModal && serviceToDelete && (
                <div
                    className="service-modal-overlay"
                    onClick={closeDeleteModal}
                >
                    <div
                        className="service-delete-modal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="service-delete-icon">
                            <FaTrash />
                        </div>
                        <h2>Delete Service?</h2>
                        <p>
                            Are you sure you want to delete
                            <strong> {serviceToDelete.title} </strong>?
                            This action cannot be undone.
                        </p>
                        <div className="service-delete-footer">
                            <button
                                type="button"
                                onClick={closeDeleteModal}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleDelete}
                            >
                                Delete Service
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
export default Services;
