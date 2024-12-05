import React from 'react';
import './404Page.css';

const NotFoundPage = () => {
  return (
    <section className="page_404">
        <div className="content_wrapper">
          
          <div className="four_zero_four_bg">
          <h1 className="four_zero_four_text">404</h1>
          </div>
          <div className="content_box_404">
            <h3 className="h2">Looks like you're lost</h3>
            <p>The page you are looking for is not available!</p>
            <a href="/" className="link_404">
              Go to Home
            </a>
          </div>
        
      </div>
    </section>
  );
};

export default NotFoundPage;