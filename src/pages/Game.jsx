import React, { useEffect, useState } from "react";
import StartPage from "../components/Game/StartPage";
import GameSection from "../components/Game/GameSection";
import EndPage from "../components/Game/EndPage";
import "./Game.css";
import { Button, Spin } from "antd";
import { getCta, updateCta } from "../services/CtaServices";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getOfferById } from "../services/OffersService";

const Game = () => {
  const { ctaId } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [gameResult, setGameResult] = useState(null);
  const [ctaDetails, setCtaDetails] = useState(null);
  const [offerDetails, setOfferDetails] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state
  const { userDetails } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const response = await getCta(ctaId, userDetails.token);
        setCtaDetails(response);
      } catch (error) {
        console.error("Error fetching CTA details:", error.message, { ctaId });
        navigate("*");
      } finally {
        setLoading(false);
      }
    };

    if (ctaId) {fetchDetails();}
    else {navigate("*");}
  }, [ctaId, userDetails.token, navigate]);

  const nextPage = () => setCurrentPage((prevPage) => prevPage + 1);

  const handleGameEnd = async (gameData) => {
    if (!gameData || typeof gameData.result !== "string") {
      console.error("Invalid game data:", gameData);
      return;
    }

    setGameResult(gameData);

    try {
      setLoading(true);

      // Update CTA
      const updateData = {
        result: gameData.result === "won" ? "success" : "failed",
      };
      const updatedCta = await updateCta(ctaId, userDetails.token, updateData);

      // Fetch offer details if applicable
      if (ctaDetails?.onSuccess?.type === "offer") {
        const offerDetails = await getOfferById(ctaDetails.onSuccess.value);

        setOfferDetails({
          offer: offerDetails,
          redemption: updatedCta.redemption,
        });
      }
    } catch (error) {
      console.error("Error updating CTA:", error.message, { ctaId });
      navigate("*");
    } finally {
      setLoading(false);
    }

    nextPage();
  };

  const renderPageContent = () => {
    switch (currentPage) {
      case 1:
        return <StartPage onNext={nextPage} ctaDetails={ctaDetails} />;
      case 2:
        return <GameSection onGameEnd={handleGameEnd} ctaDetails={ctaDetails} />;
      case 3:
        return (
          <EndPage
          gameResult={gameResult}
          ctaDetails={ctaDetails}
          offer={offerDetails || { offer: null, redemption: null }}
        />
        );
      default:
        return <StartPage onNext={nextPage} ctaDetails={ctaDetails} />;
    }
  };

  return (
    <div className="game-page">
      {loading ? (
        <div className="spinner-container">
          <Spin size="large" />
        </div>
      ) : (
        renderPageContent()
      )}
    </div>
  );
};

export default Game;
