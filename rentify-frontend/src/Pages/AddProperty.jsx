import React, { useState } from "react";
import axios from "axios";
import "../Styles/AddProperty.css";
import { useNavigate } from "react-router-dom";

const AddProperty = () => {
  const [formData, setFormData] = useState({
    photo: null,
    location: "",
    area: "",
    bedrooms: "",
    bathrooms: "",
    nearbyHospital: "",
    nearbyCollege: "",
    rent: "",
    maintenance: "",
    noOfTenantsAllowed: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, photo: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    for (let key in formData) {
      data.append(key, formData[key]);
    }

    try {
      const token = localStorage.getItem("accessToken");
      const userData = JSON.parse(localStorage.getItem("userData"));
      const userId = userData._id;
      data.append("userId", userId);
      const response = await axios.post(
        " /api/properties",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      navigate("/SellerProperty");
      alert("Property added successfully!");
    } catch (error) {
      if (error.response) {
        console.error("Error response:", error.response.data);
        alert(`Failed to add property: ${error.response.data.message}`);
      } else if (error.request) {
        console.error("Error request:", error.request);
        alert("Failed to add property: No response from server.");
      } else {
        console.error("Error message:", error.message);
        alert(`Failed to add property: ${error.message}`);
      }
    }
  };

  return (
    <div className="add-property">
      <h2>Add Property</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Photo:</label>
          <input
            type="file"
            name="photo"
            onChange={handleFileChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Location(Name of the Residency):</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Area:</label>
          <input
            type="text"
            name="area"
            value={formData.area}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Bedrooms:</label>
          <input
            type="number"
            name="bedrooms"
            value={formData.bedrooms}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Bathrooms:</label>
          <input
            type="number"
            name="bathrooms"
            value={formData.bathrooms}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Nearby Hospital (km):</label>
          <input
            type="number"
            name="nearbyHospital"
            value={formData.nearbyHospital}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Nearby College (km):</label>
          <input
            type="number"
            name="nearbyCollege"
            value={formData.nearbyCollege}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Rent:</label>
          <input
            type="number"
            name="rent"
            value={formData.rent}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Maintenance:</label>
          <input
            type="number"
            name="maintenance"
            value={formData.maintenance}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>No of Tenants Allowed:</label>
          <input
            type="number"
            name="noOfTenantsAllowed"
            value={formData.noOfTenantsAllowed}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Add Property</button>
      </form>
    </div>
  );
};

export default AddProperty;
