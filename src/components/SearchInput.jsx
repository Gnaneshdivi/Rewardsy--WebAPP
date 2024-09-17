import React, { useState, useEffect } from 'react';
import "./SearchInput.css";

function SearchInput() {
  const [location, setLocation] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const api_key=import.meta.env.VITE_GEOLOCATION_API_KEY;
            const response = await fetch(`https://geocode.maps.co/reverse?lat=${latitude}&lon=${longitude}&api_key=${api_key}`);
            const data = await response.json();
            if (data.display_name && data.display_name.length > 0) {
              setLocation(data.display_name);
            } else {
              setLocation(`Lat: ${latitude.toFixed(2)}, Long: ${longitude.toFixed(2)}`);
            }
          } catch (error) {
            console.error("Error fetching location details:", error);
            setLocation(`Lat: ${latitude.toFixed(2)}, Long: ${longitude.toFixed(2)}`);
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
    setSearchTerm(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Searching for', searchTerm, 'in', location);
  };

  return (
    <form onSubmit={handleSubmit} className="search-form">
      <div className="input-container">
        <div className="input-wrapper">
          <span className="icon">📍</span>
          <input
            type="text"
            value={location}
            onChange={handleLocationChange}
            placeholder="Location"
            className="input"
          />
        </div>
        <div className="divider"></div>
        <div className="input-wrapper">
          <span className="icon">🔍</span>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search items"
            className="input"
          />
        </div>
      </div>
      <button type="submit" className="search-button">
        Search
      </button>
      {error && <p className="error-message">{error}</p>}
    </form>
  );
}

export default SearchInput;