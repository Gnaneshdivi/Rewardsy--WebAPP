import React from "react";
import { Row, Col, Card } from "antd";
import "./categories.css";

const Categories = ({ categories, setSelectedCategory, selectedCategory }) => {
  return (
    <div className="categories-container">
      <div className="categories-list">
        {categories.map((category, index) => (
          <div
            key={index}
            className={
              selectedCategory === category.name
                ? "selected-item"
                : "category-item"
            }
            onClick={() => setSelectedCategory(category.name)}
          >
            <img className="category-icon" src={category.asset} alt={category.name} />
            <p className="category-name">{category.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
