import React, { useEffect, useRef } from 'react';
import './categories.css';

const Categories = ({ categories }) => {
  const listRef = useRef(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollLeft = 0; // Reset the scroll position
      const listElement = listRef.current;
      const firstItem = listElement.querySelector('.category-item');
      if (firstItem) {
        const itemWidth = firstItem.offsetWidth;
        const containerWidth = listElement.offsetWidth;
        const totalItemsWidth = itemWidth * categories.length + (categories.length - 1) * 20; // Include margin space
        if (containerWidth > totalItemsWidth) {
          listElement.style.justifyContent = 'center';
        } else {
          listElement.style.justifyContent = 'flex-start';
        }
      }
    }
  }, [categories]);

  return (
    <div className="categories-container">
      <h2 className="categories-title">Categories</h2>
      <div className="categories-list" ref={listRef}>
        {categories.map((category, index) => (
          <div key={index} className="category-item">
            <div className="category-icon"></div>
            <p className="category-name">{category}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
