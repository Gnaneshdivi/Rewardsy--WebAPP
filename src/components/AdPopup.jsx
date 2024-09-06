import React from "react";

const AdPopup = ({ adData, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-5 rounded-lg shadow-lg max-w-sm w-full">
        <h4 className="text-lg font-bold mb-3 text-center text-black">
          Advertisement
        </h4>
        {adData.ads_link && (
          <div className="mb-3 flex justify-center">
            <a
              href={adData.ads_link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-700"
            >
              <img
                src={adData.ads_link}
                alt="ad"
                className="w-full h-auto object-cover rounded-lg"
              />
            </a>
          </div>
        )}
        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700 transition duration-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdPopup;
