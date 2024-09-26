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
            // Fetch geolocation data
            const response = await fetch(
              `https://geocode.maps.co/reverse?lat=${latitude}&lon=${longitude}`
            );
            const data = await response.json();

            // Extract area or city name from the response
            if (data.address) {
              const area =
                data.address.city ||
                data.address.town ||
                data.address.village ||
                data.address.state;
              setLocation("📍 "+area);
            } else {
              setLocation("📍 Unknown area");
            }
          } catch (error) {
            console.error("Error fetching location details:", error);
            setLocation("Unknown area");
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
    // console.log(value)
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Searching for", searchTerm, "in", location);
  };

  return (
    <form onSubmit={handleSubmit} className="search-form">
      <div className="input-container">
        <div className="input-wrapper">
          <input
            type="text"
            value={location}
            onChange={handleLocationChange}
            placeholder="📍 Location"
            className="input-location"
          />
        </div>
        <div className="input-wrapper">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search"
            className="input-search"
          />
        </div>
      </div>
      <button type="submit" className="search-button">
      🔍
      </button>
      {error && <p className="error-message">{error}</p>}
    </form>
  );
}

export default SearchInput;
