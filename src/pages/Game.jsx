// src/pages/Game.js
import React, { useState, useEffect } from "react";
import { Layout, Modal } from "antd";
import { useParams } from "react-router-dom";
import StartPage from "../components/Game/StartPage";
import GameSection from "../components/Game/GameSection";
import EndPage from "../components/Game/EndPage";
import "./Game.css";

const { Content } = Layout;

const Game = () => {
  const { gameId } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [showTutorial, setShowTutorial] = useState(true);

  const nextPage = () => {
    if (currentPage < 3) {
      setCurrentPage(currentPage + 1);
    }
  };

  const previousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const renderPageContent = () => {
    switch (currentPage) {
      case 1:
        return <StartPage gameId={gameId} onNext={nextPage} />;
      case 2:
        return <GameSection gameId={gameId} />;
      case 3:
        return <EndPage gameId={gameId} />;
      default:
        return <StartPage gameId={gameId} onNext={nextPage} />;
    }
  };

  return (
    <Layout className="game-page">
      <Content className="game-content full-screen">
        {renderPageContent()}
      </Content>
    </Layout>
  );
};

export default Game;