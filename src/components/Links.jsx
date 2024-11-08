// src/components/Links.js
import React, { useEffect, useState } from "react";
import "./Links.css";
import { getLinksByScreen } from "../services/LinksService";
import { Modal, Button, Divider } from "antd"; 
import { FilePdfOutlined, PlayCircleOutlined, FileImageOutlined } from '@ant-design/icons';

const Links = ({ config }) => {
  const [links, setLinks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const data = config?.links?.length ? config.links : await getLinksByScreen("store", config?.merchantid);
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
      overlay: {}
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
    const extension = url.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) return 'image';
    if (['mp4', 'webm'].includes(extension)) return 'video';
    if (['pdf'].includes(extension)) return 'pdf';
    return 'other';
  };

  const handleLinkClick = (link) => {
    if (link.type === "overlay") {
      setModalContent(link.url);
      setIsModalOpen(true);
    } else {
      window.location.href = link.url;
    }
  };

  const renderAsset = (url) => {
    const assetType = determineAssetType(url);
    switch (assetType) {
      case 'image':
        return <img src={url} alt="Asset" className="overlay-image" />;
      case 'video':
        return (
          <video controls className="overlay-video">
            <source src={url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        );
      case 'pdf':
        return (
          <Button
            type="primary"
            icon={<FilePdfOutlined />}
            onClick={() => window.open(url, '_blank')}
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
    setModalContent(null);
  };

  if (isLoading) return null;

  return (
    <>
      {/* Redirection Section */}
      <div className="redirection-section">
        <div className={`chips-container ${isExpanded ? "expanded" : ""}`}>
          {links.redirection.map((link, index) => (
            <div
              key={index}
              className="chip"
              onClick={() => handleLinkClick(link)}
            >
              {link.text}
            </div>
          ))}
        </div>
      </div>

      <div className="overlay-section">
        {Object.keys(links.overlay).map((identifier, index) => (
          <React.Fragment key={identifier}>
          <div className="overlay-group">
            <h3 className="overlay-group-title">{identifier}</h3>
            <div className="overlay-horizontal-scroll">
              {links.overlay[identifier].map((link, linkIndex) => (
                <div className="overlay-item" key={linkIndex} onClick={() => handleLinkClick(link)}>
                  {renderAsset(link.link)}
                </div>
              ))}
            </div>
            <Divider className="section-divider" />
          </div>
          
        </React.Fragment>
        
        ))}
      </div>

      {/* Modal for viewing assets */}
      <Modal open={isModalOpen} onCancel={closeModal} footer={null} centered className="overlay-modal">
        {modalContent && (
          <div className="modal-overlay-content">
            {renderAsset(modalContent)}
          </div>
        )}
      </Modal>
    </>
  );
};

export default Links;
