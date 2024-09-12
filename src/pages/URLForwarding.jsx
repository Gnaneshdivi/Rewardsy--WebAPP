// src/pages/URLForwarding.js
import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

const URLForwarding = () => {
  const { shortUrl } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMapping = async () => {
      try {
        const docRef = doc(db, "qr", shortUrl);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          const link = data.link;
          const img = data.ads_link;
          navigate(`${link}`+`?showAd=true&img=${encodeURI(img)}`, { replace: true });
        } else {
          navigate("/home", { replace: true });
        }
      } catch (error) {
        navigate("/home", { replace: true });
      }
    };

    fetchMapping();
  }, [shortUrl, navigate]);

  return <></>;
};

export default URLForwarding;
