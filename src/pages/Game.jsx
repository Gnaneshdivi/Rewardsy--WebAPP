import React, { useState } from "react";
import StartPage from "../components/Game/StartPage";
import GameSection from "../components/Game/GameSection";
import EndPage from "../components/Game/EndPage";
import "./Game.css";

const Game = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [gameResult, setGameResult] = useState(null);

  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const handleGameEnd = (gameData) => {
    setGameResult(gameData);
    nextPage();
  };

  const renderPageContent = () => {
    switch (currentPage) {
      case 1:
        return <StartPage gameId="memorygame" onNext={nextPage} />;
      case 2:
        return <GameSection gameId="memorygame"onGameEnd={handleGameEnd} />;
      case 3:
        return <EndPage gameId="memorygame"gameResult={gameResult} />;
      default:
        return <StartPage gameId="memorygame" onNext={nextPage} />;
    }
  };

  return (
    <div className="game-page">
      {renderPageContent()}
    </div>
  );
};

export default Game;