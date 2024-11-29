import React from "react";
import { Typography } from "antd";
import "./EndPage.css";

const { Title, Paragraph } = Typography;

const EndPage = ({ gameId }) => {
  return (
    <div className="end-page-content">
      <Title level={2}>Congratulations!</Title>
      <Paragraph>You've finished Game {gameId}!</Paragraph>
    </div>
  );
};

export default EndPage;