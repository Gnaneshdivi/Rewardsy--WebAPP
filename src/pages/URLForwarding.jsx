// src/pages/URLForwarding.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import AdPopup from "../components/AdPopup";

const URLForwarding = () => {
  const { shortUrl } = useParams();
  const navigate = useNavigate();
  const [adData, setAdData] = useState(null);

  useEffect(() => {
    const fetchMapping = async () => {
      try {
        const docRef = doc(db, "qr", shortUrl);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.active && data.ads) {
            setAdData(data);
          }
          navigate(`${data.link}`, { replace: true });
        } else {
          navigate("/home", { replace: true });
        }
      } catch (error) {
        navigate("/home", { replace: true });
      }
    };

    fetchMapping();
  }, [shortUrl, navigate]);

  return (
    <div>
      {adData && <AdPopup adData={adData} onClose={() => setAdData(null)} />}
      Redirecting...
    </div>
  );
};

export default URLForwarding;
