// src/pages/URLForwarding.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { CgSpinner } from "react-icons/cg";

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
          console.log(data);
          navigate(`${data.link}`, { state: { data }, replace: true });
        } else {
          navigate("/home", {
            state: { error: "No data found" },
            replace: true,
          });
        }
      } catch (error) {
        navigate("/home", { error: "Error fetching data", replace: true });
      }
    };

    fetchMapping();
  }, [shortUrl, navigate]);

  return (
    <div className="flec justify-center">
      <CgSpinner />
    </div>
  );
};

export default URLForwarding;
