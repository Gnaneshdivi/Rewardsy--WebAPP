import React, { useEffect } from "react";

const AdPopup = ({ adData, onClose }) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "visible";
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50 py-10">
      <div className="relative bg-white px-2 sm:px-5 pt-2 border border-black rounded-lg w-full sm:w-full lg:w-3/4 h-full max-h-full mx-4 overflow-auto">
        {/* Close "X" button at the top right */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-black text-2xl font-bold hover:text-red-500 transition duration-300"
        >
          &times;
        </button>

        <h4 className="text-lg font-bold text-black mb-3 text-center">
          Advertisement
        </h4>
        {adData.ads_link && (
          <img
            src={adData.ads_link}
            alt="ad"
            className="w-full h-full object-cover rounded-md mb-3"
          />
        )}
      </div>
    </div>
  );
};

export default AdPopup;
