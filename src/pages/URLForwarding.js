// src/pages/URLForwarding.js
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc } from "firebase/firestore";



const URLForwarding = () => {
  const { shortUrl } = useParams();
  const navigate = useNavigate();

  

  useEffect(() => {
    const fetchMapping = async () => {
        
        try {
            const docRef = doc(db, 'urlMappings', shortUrl);
            const docSnap = await getDoc(docRef);
    
            if (docSnap.exists()) {
              const data = docSnap.data();
              navigate(`${data.link}`, { replace: true });
            } else {
              navigate('/home', { replace: true });
            }
          } catch (error) {
            navigate('/home', { replace: true });
          }
        };

    fetchMapping();
  }, [shortUrl, navigate]);

  return <div>Redirecting...</div>;
};

export default URLForwarding;
