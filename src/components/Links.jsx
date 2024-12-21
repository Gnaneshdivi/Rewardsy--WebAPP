import React, { useEffect, useRef, useState } from "react";
import "./Links.css";
import { getLinksByScreen } from "../services/LinksService";
import { Modal, Button, Divider, Carousel } from "antd";
import { FilePdfOutlined } from "@ant-design/icons";
import { getSocialIcon } from "../utils/getSocialIcon";

const Links = ({ config }) => {
  const [links, setLinks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentLink, setCurrentLink] = useState({ group: null, index: 0 });
  const carouselRef = useRef(null); // Ref for the Carousel

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const data = config?.links?.length
          ? config.links
          : await getLinksByScreen("store", config?.merchantid);
        const sortedLinks = sortLinks(data);
        setLinks(sortedLinks);
      } catch (error) {
        console.error("Error fetching merchant links:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLinks();
  }, [config?.merchantid]);

  const sortLinks = (links) => {
    const sortedData = {
      upi: [],
      social: [],
      redirection: [],
      overlay: {},
    };

    links.forEach((link) => {
      switch (link.type) {
        case "upi":
          sortedData.upi.push(link);
          break;
        case "social":
          sortedData.social.push(link);
          break;
        case "overlay":
          if (link.location && link.location.startsWith("store/view")) {
            const identifier = link.location.split("/")[2];
            if (!sortedData.overlay[identifier]) {
              sortedData.overlay[identifier] = [];
            }
            sortedData.overlay[identifier].push(link);
          } else {
            sortedData.redirection.push(link);
          }
          break;
        case "redirect":
          sortedData.redirection.push(link);
          break;
        default:
          console.warn("Unknown link type:", link.type);
      }
    });
    return sortedData;
  };

  const determineAssetType = (url) => {
    const extension = url.split(".").pop().toLowerCase();
    if (["jpg", "jpeg", "png", "gif"].includes(extension)) return "image";
    if (["mp4", "webm"].includes(extension)) return "video";
    if (["pdf"].includes(extension)) return "pdf";
    return "other";
  };

  const renderAsset = (url) => {
    const assetType = determineAssetType(url);
    switch (assetType) {
      case "image":
        return <img src={url} alt="Asset" className="overlay-image" />;
      case "video":
        return (
          <video controls className="overlay-video">
            <source src={url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        );
      case "pdf":
        return (
          <Button
            type="primary"
            icon={<FilePdfOutlined />}
            onClick={() => window.open(url, "_blank")}
          >
            Open PDF
          </Button>
        );
      default:
        return <img src={url} alt="Asset" className="overlay-image" />;
    }
  };

  const openModal = (group, index) => {
    setCurrentLink({ group, index });
    setIsModalOpen(true);

    setTimeout(() => {
      if (carouselRef.current) {
        carouselRef.current.goTo(index); 
      }
    }, 0);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (isLoading) return null;

  return (
    <>
      <div className="social-links">
        {links.social.map((link, index) => (
          <Button
            key={index}
            icon={getSocialIcon(link.url)}
            onClick={() => window.open(link.url, "_blank")}
            className="social-icon-button"
          />
        ))}
      </div>

      <div className="redirection-section">
        <div className="chips-container">
          {links.redirection.map((link, index) => (
            <div
              key={index}
              className="chip"
              onClick={() => window.open(link.url, "_blank")}
            >
              {link.text}
            </div>
          ))}
        </div>
      </div>

      <div className="overlay-section">
        {Object.keys(links.overlay).map((group) => (
          <React.Fragment key={group}>
            <div className="overlay-group">
              <h3 className="overlay-group-title">{group}</h3>
              <div className="overlay-horizontal-scroll">
                {links.overlay[group].map((link, index) => (
                  <div
                    className="overlay-item"
                    key={index}
                    onClick={() => openModal(group, index)}
                  >
                    {renderAsset(link.icon)}
                  </div>
                ))}
              </div>
              <Divider className="section-divider" />
            </div>
          </React.Fragment>
        ))}
      </div>

      <Modal
        open={isModalOpen}
        onCancel={closeModal}
        footer={null}
        centered
        className="overlay-modal"
      >
        {currentLink.group && (
          <Carousel
            arrows
            ref={carouselRef} 
          >
            {links.overlay[currentLink.group].map((link, index) => (
              <div key={index} className="carousel-item">
                {renderAsset(link.url)}
              </div>
            ))}
          </Carousel>
        )}
      </Modal>
    </>
  );
};

export default Links;
