// src/components/Links.js
import React, { useEffect, useState } from "react";
import "./Links.css";
import { getLinksByStore, getLinkUpiById } from "../services/LinksService"; // Import necessary services
import { Modal, Drawer } from "antd"; // Drawer for UPI, Modal for overlay
import { SocialIcon } from "react-social-icons";

const Links = ({ config }) => {
  const [links, setLinks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [socialLinks, setSocialLinks] = useState([]);

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const data = await getLinksByStore(config?.merchantid);
        const sortedLinks = sortLinks(data);
        setLinks(sortedLinks.links);
        setSocialLinks(sortedLinks.socialLinks);
      } catch (error) {
        console.error("Error fetching merchant links:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLinks();
  }, [config?.merchantid]);

  const sortLinks = (links) => {
    const upiLinks = links.filter((link) => link.type === "upi");
    const otherLinks = links
      .filter((link) => link.type !== "upi" && link.type !== "social")
      .sort((a, b) => a.location.localeCompare(b.location));
    const socialLinks = links.filter((link) => link.type === "social");
    return { links: [...upiLinks, ...otherLinks], socialLinks };
  };

  const handleLinkClick = (link) => {
    switch (link.type) {
      case "upi":
        setIsDrawerOpen(true);
        break;
      case "overlay":
        setModalContent(link.url);
        setIsModalOpen(true);
        break;
      case "redirect":
        window.location.href = link.url;
        break;
      default:
        console.warn("Unknown link type:", link.type);
    }
  };

  const handlePaymentAppClick = async (appName) => {
    try {
      const upiLink = links.find((link) => link.type === "upi");
      if (!upiLink) throw new Error("UPI link not found");
window.location.href="phonepe://pay?pa=Q263512182@ybl&pn=PhonePeMerchant&mc=0000&mode=00&purpose=00"
      const upiData = await getLinkUpiById(upiLink.url); // Fetch UPI data using service
      const redirectUrl = buildUpiUrl(
        appName,
        upiData.pa,
        upiData.pn,
        upiData.aid,
        upiLink.url
      );
      window.location.href = redirectUrl;
    } catch (error) {
      console.error("Error during UPI payment:", error);
    }
  };

  const buildUpiUrl = (origin, pa, pn, aid, defaultLink) => {
    const encodedPn = encodeURIComponent(pn);
    const upiBaseUrl = `upi://pay?pa=${pa}&pn=${encodedPn}&mc=0000&mode=00&purpose=00`;

    switch (true) {
      case origin.toLowerCase().includes("gpay"):
        return upiBaseUrl.replace("upi://", "gpay://");
      case origin.toLowerCase().includes("paytm"):
        return upiBaseUrl.replace("upi://", "paytm://");
      case origin.toLowerCase().includes("phonepe"):
        return upiBaseUrl.replace("upi://", "phonepe://");
      default:
        return defaultLink;
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent(null);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  if (isLoading) return null;

  return (
    <>
      <div className="social-links-container">
        {socialLinks.map((link, index) => (
          <div key={index} className="social-button">
            <SocialIcon url={link.url} className="social-icon" target="_blank" rel="noopener noreferrer" style={{height:40,width:40}}/>
          </div>
        ))}
      </div>

      <div className="links-container">
        {links.map((link, index) => (
          <div key={index} className="link-item" onClick={() => handleLinkClick(link)}>
            <span className="link-icon">
              <img src={link.icon} alt="" className="icon" />
            </span>
            <span className="link-text">{link.text}</span>
          </div>
        ))}
      </div>

      <Modal open={isModalOpen} onCancel={closeModal} footer={null} centered className="overlay-modal">
        <img src={modalContent} alt="Overlay Content" className="overlay-image" />
      </Modal>

      <Drawer placement="bottom" closable={false} onClose={closeDrawer} open={isDrawerOpen} height={150}>
        <div className="payment-icons">
          {["GPay", "Paytm", "PhonePe"].map((app) => (
            <div key={app} className="payment-icon-container">
              <img
                src={`/payment/${app.toLowerCase()}.png`}
                alt={app}
                className="payment-icon"
                onClick={() => handlePaymentAppClick(app)}
              />
            </div>
          ))}
        </div>
      </Drawer>
    </>
  );
};

export default Links;
