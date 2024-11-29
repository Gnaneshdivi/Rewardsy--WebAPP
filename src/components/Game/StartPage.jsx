// src/pages/StartPage.js
import React, { useEffect, useState } from "react";
import { Button, Spin } from "antd";
import "./StartPage.css";

const StartPage = ({ gameId, onNext }) => {
  const [backgroundImage, setBackgroundImage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBackgroundImage = async () => {
      try {
        // Simulate API call to get the image URL with a delay
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulated waiting time
        // Placeholder for actual API response
        setBackgroundImage(`${window.location.origin}/game/game.png`);
      } catch (error) {
        console.error("Error fetching background image:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBackgroundImage();
  }, [gameId]);

  if (loading) {
    return (
      <div className="spinner-container">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="start-page-content" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <Button className="start-button" style={{ fontWeight: "bold" }} onClick={onNext}>Start</Button>
    </div>
  );
};

export default StartPage;