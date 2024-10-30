import React, { useState, useEffect } from "react";
import "./SearchInput.css";

function SearchInput({ word }) {
  const [location, setLocation] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const api_key = import.meta.env.VITE_GEOLOCATION_API_KEY;
            const response = await fetch(
              `https://geocode.maps.co/reverse?lat=${latitude}&lon=${longitude}`
            );
            const data = await response.json();

            if (data.address) {
              const area =
                data.address.city ||
                data.address.town ||
                data.address.village ||
                data.address.state;
              setLocation("📍 " + area);
            } else {
              setLocation("📍 Yeshanthpur");
            }
          } catch (error) {
            console.error("Error fetching location details:", error);
            setLocation("📍 Yeshanthpur");
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          setError("Unable to retrieve your location");
        }
      );
    } else {
      setError("Geolocation is not supported by your browser");
    }
  }, []);

  const handleLocationChange = (e) => {
    setLocation(e.target.value);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    word(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Searching for", searchTerm, "in", location);
  };

  return (
    <form onSubmit={handleSubmit} className="search-form">
      <div className="input-container">
        <div className="input-wrapper-location">
          <input
            type="text"
            value={location}
            onChange={handleLocationChange}
            placeholder="📍 Location"
            className="input-location"
          />
        </div>
        <div className="divider"></div> {/* Separator */}
        <div className="input-wrapper-search">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search"
            className="input-search"
          />
        </div>
       
      </div>
    </form>
  );
}

export default SearchInput;
