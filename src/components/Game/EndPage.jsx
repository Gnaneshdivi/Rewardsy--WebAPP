
import React, { useEffect, useState } from "react";
import './EndPage.css';
const EndPage = ({ gameId,gameResult }) => {
  
  const [backgroundImage, setBackgroundImage] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchBackgroundImage = async () => {
      try {
        // Simulate API call to get the image URL with a delay
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulated waiting time
        // Placeholder for actual API response
        setBackgroundImage(`${window.location.origin}/game/${gameId}end.png`);
      } catch (error) {
        console.error("Error fetching background image:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBackgroundImage();
  }, [gameId]);
  return (
    <div className='end-section-content' style={{ backgroundImage: `url(${backgroundImage})` }}>
      <h1>{gameResult.result === 'won' ? 'Congratulations! You Won!' : 'Game Over!'}</h1>
      <p>Moves: {gameResult.moves}</p>
      <p>Time Left: {gameResult.timeLeft}s</p>
      <button className="start-button" style={{ fontWeight: "bold" }} onClick={() => window.location.reload()}>Retry</button>
    </div>
  );
};

export default EndPage;
