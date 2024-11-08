// src/utils/getSocialIcon.js

import React from "react";
import {
  InstagramOutlined,
  YoutubeOutlined,
  FacebookOutlined,
  TwitterOutlined,
  LinkedinOutlined,
  WhatsAppOutlined,
  GlobalOutlined,
  DownloadOutlined,
} from "@ant-design/icons"; 
export const getSocialIcon = (url) => {
  if (!url) return null; // Return null if no URL is provided

  url = url.toLowerCase(); // Convert URL to lowercase for consistent matching

  if (url.includes("instagram")) return <InstagramOutlined />;
  if (url.includes("youtube")) return <YoutubeOutlined />;
  if (url.includes("facebook")) return <FacebookOutlined />;
  if (url.includes("twitter") || url.includes("x.com")) return <TwitterOutlined />;
  if (url.includes("linkedin")) return <LinkedinOutlined />;
  if (url.includes("whatsapp")) return <WhatsAppOutlined />;
  if (url.includes("threads")) return <GlobalOutlined />;
  if (url.includes("link")) return <GlobalOutlined />;
  if (url.includes("web")) return <GlobalOutlined />;
  if (url.includes("download")) return <DownloadOutlined />;

  return <GlobalOutlined />; // Return null if no matching platform is found
};

export default getSocialIcon;
