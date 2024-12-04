import React, { useEffect, useState } from "react";
import "./Links.css";
import { getLinksByScreen } from "../services/LinksService";
import { Modal, Button, Divider } from "antd";
import {
  FilePdfOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { getSocialIcon } from "../utils/getSocialIcon";

const Links = ({ config }) => {
  const [links, setLinks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentLink, setCurrentLink] = useState({ group: null, index: null });

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

  const handleLinkClick = (group, index) => {
    setCurrentLink({ group, index });
    setIsModalOpen(true);
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

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentLink({ group: null, index: null });
  };

  const handleNext = () => {
    const { group, index } = currentLink;
    const groupLinks = links.overlay[group];
    const nextIndex = (index + 1) % groupLinks.length;
    setCurrentLink({ group, index: nextIndex });
  };

  const handlePrevious = () => {
    const { group, index } = currentLink;
    const groupLinks = links.overlay[group];
    const prevIndex = (index - 1 + groupLinks.length) % groupLinks.length;
    setCurrentLink({ group, index: prevIndex });
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
                    onClick={() => handleLinkClick(group, index)}
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
        {currentLink.group !== null && currentLink.index !== null && (
          <div className="modal-overlay-content">
            {renderAsset(
              links.overlay[currentLink.group][currentLink.index].url
            )}
            <div className="modal-arrows-container">
              <Button
                icon={<LeftOutlined />}
                className="modal-arrow-left"
                onClick={handlePrevious}
              />
              <Button
                icon={<RightOutlined />}
                className="modal-arrow-right"
                onClick={handleNext}
              />
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default Links;
