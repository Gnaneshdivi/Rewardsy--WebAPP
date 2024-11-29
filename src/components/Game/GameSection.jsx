import React, { useState } from 'react';
import PlayGround from '../../Games/MatchingGame/MatchingGame';
import "./GameSection.css";
const GameSection = () => {
  

  return (
    <div className='game-section-content'>
      <PlayGround />
      
    </div>
  );
};

export default GameSection;
