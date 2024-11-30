// GameSection Component
import React, { useState } from 'react';
import PlayGround from '../../Games/MatchingGame/MatchingGame';
import "./GameSection.css";

const GameSection = ({ gameId,onGameEnd }) => {
  return (
    <div className='game-section-content'>
      <PlayGround onGameEnd={onGameEnd} />
    </div>
  );
};

export default GameSection;