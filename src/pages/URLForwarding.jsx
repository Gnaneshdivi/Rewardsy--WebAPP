// src/pages/URLForwarding.js
import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getQRDetails } from "../services/QrService"; // Import the getQRDetails function

const URLForwarding = () => {
  const { shortUrl } = useParams(); // Get the shortUrl parameter
  const navigate = useNavigate(); // For navigation

  useEffect(() => {
    const fetchAndRedirect = async () => {
      try {
        const data = await getQRDetails(shortUrl); // Fetch QR details using the API

        if (data && data.link) {
          const { link, ads, adsLink } = data;
          
          // Redirect with query parameters
          navigate(
            `${link}?showAd=${ads}&img=${encodeURIComponent(adsLink)}`,
            { replace: true }
          );
        } else {
          // Redirect to home if no valid link is found
          navigate("/home", { replace: true });
        }
      } catch (error) {
        console.error("Error fetching QR details:", error);
        // Redirect to home on any error
        navigate("/home", { replace: true });
      }
    };

    fetchAndRedirect();
  }, [shortUrl, navigate]);

  return null; 
};

export default URLForwarding;
