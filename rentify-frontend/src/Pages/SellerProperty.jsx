import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../Context/AuthContext";
import { Link } from "react-router-dom";
import "../Styles/SellerProperty.css";

const SellerProperty = () => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const getSellerProperties = async () => {
      try {
        console.log("Owner ID " + user._id);
        const response = await axios.get(
          ` /api/seller/${user._id}?page=${page}&limit=2`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        setProperties(response.data.properties);
        setFilteredProperties(response.data.properties); // Initialize with all properties
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error(error);
      }
    };

    if (user) {
      getSellerProperties();
    }
  }, [user, page]);

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = properties.filter(
      (property) =>
        property.location.toLowerCase().includes(query) ||
        property.area.toString().toLowerCase().includes(query)
    );
    setFilteredProperties(filtered);
  };

  const deleteProperty = async (propertyId) => {
    try {
      await axios.delete(` /api/properties/${propertyId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      // Remove the deleted property from the state
      setProperties(
        properties.filter((property) => property._id !== propertyId)
      );
      setFilteredProperties(
        filteredProperties.filter((property) => property._id !== propertyId)
      );
    } catch (error) {
      console.error("Error deleting property:", error);
    }
  };

  const goToNextPage = () => {
    setPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const goToPreviousPage = () => {
    setPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  return (
    <div className="seller-properties">
      <div className="header">
        <h2>
          Your Properties
          {/* ({filteredProperties.length}){" "} */}
          {/* Display the count here */}
        </h2>
        <div className="actions">
          <input
            type="text"
            placeholder="Search by location or area..."
            value={searchQuery}
            onChange={handleSearch}
            className="search-bar"
          />
          <Link to="/AddProperty" className="add-property-button">
            Add Property
          </Link>
        </div>
      </div>
      <ul>
        {filteredProperties.map((property) => (
          <li key={property._id}>
            <div className="property-photo">
              <img
                src={` /uploads/${property.photo}`}
                alt={property.location}
              />
            </div>
            <div className="property-details">
              <h3>{property.location}</h3>
              <p>Area: {property.area}</p>
              <p>
                {property.bedrooms} Bedrooms, {property.bathrooms} Bathrooms
              </p>
              <p>Nearby Hospital: {property.nearbyHospital} km</p>
              <p>Nearby College: {property.nearbyCollege} km</p>
              <p>Rent: ₹{property.rent}</p>
              <p>Maintenance: ₹{property.maintenance}</p>
              <p>No. of Tenants Allowed: {property.noOfTenantsAllowed}</p>
              <button
                className="delete-button"
                onClick={() => deleteProperty(property._id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
      {filteredProperties.length === 0 && (
        <p>You haven't added any properties yet.</p>
      )}
      <div className="pagination">
        <button onClick={goToPreviousPage} disabled={page === 1}>
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button onClick={goToNextPage} disabled={page === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
};

export default SellerProperty;
