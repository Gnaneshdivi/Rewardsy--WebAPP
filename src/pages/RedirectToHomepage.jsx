// src/pages/RedirectToHome.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const RedirectToHome = () => {
  return <Navigate to="/home" />;
};

export default RedirectToHome;
