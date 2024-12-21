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
import { SocialIcon } from "react-social-icons";

export const getSocialIcon = (url) => {
  if (!url) return null; 

  url = url.toLowerCase(); 

  if (url.includes("instagram")) return <SocialIcon url="https://instagram.com" />;
  if (url.includes("youtube")) return <SocialIcon url="https://youtube.com" />;
  if (url.includes("facebook")) return <SocialIcon url="https://facebook.com" />;
  if (url.includes("twitter") || url.includes("x.com")) return <SocialIcon url="https://twitter.com" />;
  if (url.includes("linkedin")) return <SocialIcon url="https://linkedin.com" />;
  if (url.includes("whatsapp")) return <SocialIcon url="https://whatsapp.com" />;
  if (url.includes("threads")) return <SocialIcon url="https://threads.net" />;
  if (url.includes("link")) return <SocialIcon url={url} network="sharethis" />; // Generic share icon
  if (url.includes("web")) return <SocialIcon url={url} network="website" />; // Website icon
  if (url.includes("download")) return <SocialIcon url={url} network="email"/>;

  return <GlobalOutlined />; // Return null if no matching platform is found
};

export default getSocialIcon;
