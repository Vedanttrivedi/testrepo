import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Modal from "../Components/Modal";
import "../Styles/Properties.css";
import { AuthContext } from "../Context/AuthContext";
import Loader from "../Components/Loader";

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [location, setLocation] = useState("");
  const [area, setArea] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [nearbyHospital, setNearbyHospital] = useState("");
  const [nearbyCollege, setNearbyCollege] = useState("");
  const [rentRange, setRentRange] = useState({ min: "", max: "" });
  const [maintenanceRange, setMaintenanceRange] = useState({
    min: "",
    max: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(2); // Number of items per page
  const [showModal, setShowModal] = useState(false);
  const [contactDetails, setContactDetails] = useState(null);
  const [likeCounts, setLikeCounts] = useState({});
  const [isLoading, setIsLoading] = useState(false); // State to track loading status
  const navigate = useNavigate();
  const { isLoggedIn, user } = useContext(AuthContext); // Use AuthContext to get the current user and auth status

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await axios.get(" /api/properties");
      setProperties(response.data);
      updateLikeCounts(response.data);
    } catch (error) {
      console.error("Error fetching properties:", error);
    }
  };

  const updateLikeCounts = async (properties) => {
    const counts = {};
    for (const property of properties) {
      counts[property._id] = await getLikeCount(property._id);
    }
    setLikeCounts(counts);
  };

  const handleFilter = async () => {
    try {
      const params = {
        location,
        area,
        bedrooms,
        bathrooms,
        nearbyHospital,
        nearbyCollege,
        rentMin: rentRange.min,
        rentMax: rentRange.max,
        maintenanceMin: maintenanceRange.min,
        maintenanceMax: maintenanceRange.max,
      };

      const response = await axios.get(" /api/filter", {
        params,
      });
      setProperties(response.data);
      updateLikeCounts(response.data);
    } catch (error) {
      console.error("Error filtering properties:", error.message);
      alert(`Error filtering properties: ${error.message}`);
    }
  };

  const getContactDetails = async (ownerId) => {
    try {
      const response = await axios.get(
        ` /api/users/${ownerId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching contact details:", error);
      return null;
    }
  };

  const handleInterestedClick = async (property) => {
    if (!isLoggedIn) {
      navigate("/signin");
    } else {
      const contactData = await getContactDetails(property.ownerId);
      if (contactData) {
        setContactDetails({
          name: `${contactData.firstName} ${contactData.lastName}`,
          email: contactData.email,
          phone: contactData.phone,
        });

        // Start loading
        setIsLoading(true);

        // Make a POST request to send contact details to the user
        try {
          await axios.post(
            ` /api/properties/${user.email}`,
            {
              name: `${contactData.firstName} ${contactData.lastName}`,
              email: contactData.email,
              phone: contactData.phone,
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              },
            }
          );
          console.log("Contact details sent successfully");

          // Stop loading
          setIsLoading(false);

          // Show modal after successful sending
          setShowModal(true);
        } catch (error) {
          console.error("Error sending contact details:", error);
          alert(`Error sending contact details: ${error.message}`);

          // Stop loading in case of error
          setIsLoading(false);
        }
      }
    }
  };
  const handleLike = async (propertyId) => {
    try {
      if (!isLoggedIn) {
        navigate("/signin");
        return;
      }

      const userId = user._id;
      const liked = await isPropertyLiked(propertyId);

      console.log("Property is " + liked);

      if (liked) {
        // Show dialog box to confirm unlike action
        const confirmUnLike = window.confirm(
          "You have already liked this property. Do you want to remove your like?"
        );

        if (confirmUnLike) {
          await axios.delete(
            ` /api/likes/deleteLike/${propertyId}/${userId}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              },
            }
          );

          updateLikeCounts(properties);
        }
      } else {
        await axios.post(
          " /api/likes/addLike",
          {
            userId,
            propertyId,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        updateLikeCounts(properties);
      }
    } catch (error) {
      console.error("Error handling like:", error);
      alert(`Error handling like: ${error.message}`);
    }
  };

  const getLikeCount = async (propertyId) => {
    try {
      const response = await axios.get(
        ` /api/likes/likeCount/${propertyId}`
      );
      return response.data.likeCount;
    } catch (error) {
      console.error("Error fetching like count:", error);
      return 0;
    }
  };

  const isPropertyLiked = async (propertyId) => {
    try {
      const userId = user._id;
      const response = await axios.get(
        ` /api/likes/isLiked/${propertyId}/${userId}`
      );
      return response.data.isLiked;
    } catch (error) {
      console.error("Error checking if property is liked:", error);
      return false;
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = properties.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  return (
    <div className="properties-container">
      <h1 className="header">Properties</h1>
      <div className="filter-section">
        <input
          type="text"
          placeholder="Location (Name)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <input
          type="text"
          placeholder="Area"
          value={area}
          onChange={(e) => setArea(e.target.value)}
        />
        <input
          type="number"
          placeholder="Bedrooms"
          value={bedrooms}
          onChange={(e) => setBedrooms(e.target.value)}
        />
        <input
          type="number"
          placeholder="Bathrooms"
          value={bathrooms}
          onChange={(e) => setBathrooms(e.target.value)}
        />
        <input
          type="number"
          placeholder="Nearby Hospital (km)"
          value={nearbyHospital}
          onChange={(e) => setNearbyHospital(e.target.value)}
        />
        <input
          type="number"
          placeholder="Rent Min"
          value={rentRange.min}
          onChange={(e) => setRentRange({ ...rentRange, min: e.target.value })}
        />
        <input
          type="number"
          placeholder="Rent Max"
          value={rentRange.max}
          onChange={(e) => setRentRange({ ...rentRange, max: e.target.value })}
        />
        <input
          type="number"
          placeholder="Maintenance Min"
          value={maintenanceRange.min}
          onChange={(e) =>
            setMaintenanceRange({ ...maintenanceRange, min: e.target.value })
          }
        />
        <input
          type="number"
          placeholder="Maintenance Max"
          value={maintenanceRange.max}
          onChange={(e) =>
            setMaintenanceRange({ ...maintenanceRange, max: e.target.value })
          }
        />

        <button onClick={handleFilter}>Filter</button>
      </div>
      <ul className="properties-list">
        {currentItems.map((property) => (
          <li key={property._id} className="property-item">
            <div className="property-info">
              <img
                src={` /uploads/${property.photo}`}
                alt={property.location}
                className="property-photo"
              />
              <div className="details">
                <h2>{property.location}</h2>
                <p>Area: {property.area}</p>
                <p>Bedrooms: {property.bedrooms}</p>
                <p>Bathrooms: {property.bathrooms}</p>
                <p>Nearby Hospital: {property.nearbyHospital} km</p>
                <p>Nearby College: {property.nearbyCollege} km</p>
                <p>Rent: ₹{property.rent}</p>
                <p>Maintenance: ₹{property.maintenance}</p>
                <p>No. of Tenants Allowed: {property.noOfTenantsAllowed}</p>
              </div>
            </div>
            <button
              className="like-button"
              onClick={() => handleLike(property._id)}
            >
              {likeCounts[property._id] > 0
                ? `Like (${likeCounts[property._id]})`
                : "Like"}
            </button>
            <button
              className="interested-button"
              onClick={() => handleInterestedClick(property)}
            >
              I'm Interested
            </button>
          </li>
        ))}
      </ul>
      <ul className="pagination">
        {Array.from(
          { length: Math.ceil(properties.length / itemsPerPage) },
          (_, i) => (
            <li key={i} className="page-item">
              <button onClick={() => paginate(i + 1)} className="page-link">
                {i + 1}
              </button>
            </li>
          )
        )}
      </ul>
      {isLoading && <Loader />} {/* Show loader if isLoading is true */}
      {properties.length === 0 && <p>No properties found.</p>}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        contactDetails={contactDetails}
      />
    </div>
  );
};

export default Properties;
