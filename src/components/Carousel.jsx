import React from "react";
import { Carousel } from "antd";
import "./Carousel.css";
const contentStyle = {};

const CarouselComponent = ({ images }) => {
  return (
    <div className="carousel">
      <div className="carousel-inner">
        <Carousel autoplay>
          {images.map((image, index) => (
            <div
              key={index}
              className={`carousel-item ${index === 0 ? "active" : ""}`}
              style={contentStyle}
            >
              <img src={image} />
            </div>
          ))}
        </Carousel>
      </div>
    </div>
  );
};

export default CarouselComponent;
