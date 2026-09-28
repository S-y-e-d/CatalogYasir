import { useState } from "react";
import "./CategoryFilterBar.css";

function CategoryFilterBar() {
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = [
    "All",
    "Clothes",
    "Shoes",
    "Accessories",
    "Electronics",
    "Home",
  ];

  return (
    <div className="category-filter-bar">
      {categories.map((category) => (
        <button
          key={category}
          className={`category-filter ${
            activeCategory === category
              ? "category-filter--active"
              : ""
          }`}
          onClick={() => setActiveCategory(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
}

export default CategoryFilterBar;