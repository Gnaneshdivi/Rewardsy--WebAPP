import React, { useState } from "react";
import { Modal } from "antd";
import "./AdPopup.css"; // Import the updated CSS file

const AdPopup = ({ img, onClose }) => {
  const [visible, setVisible] = useState(true);

  const handleCancel = () => {
    setVisible(false);
    if (onClose) {
      onClose();
    }
  };

  return (
    <Modal
      visible={visible} // Modal visibility controlled here
      footer={null} // No footer buttons
      onCancel={handleCancel} // Properly handle modal close
      centered // Center the modal
      bodyStyle={{ padding: 0, margin: 0 }} // Ensure no padding/margin around the modal content
      className="ad-popup-modal"
    >
      <div className="ad-popup-image-container">
        {img && (
          <img
            src={img}
            alt="ad"
            className="ad-popup-image" // Apply the CSS class for the image
            style={{ width: "100%", height: "auto", objectFit: "cover" }} // Ensure image fits the modal
          />
        )}
      </div>
    </Modal>
  );
};

export default AdPopup;
