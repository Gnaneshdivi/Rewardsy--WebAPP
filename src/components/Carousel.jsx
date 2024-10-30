import React from "react";
import { Carousel } from "antd";
import "./Carousel.css";

const CarouselComponent = ({ images }) => {
  return (
    <div className="carousel-container">
      <Carousel autoplay className="carousel">
        {images.map((image, index) => (
            <img src={image} alt={`carousel-${index}`} className="carousel-image" />
          
        ))}
      </Carousel>
    </div>
  );
};

export default CarouselComponent;
