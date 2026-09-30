import { useState } from "react";
import "./CategoryFilterBar.css";

function CategoryFilterBar({ setFilteredProducts, products }) {
  const [activeCategory, setActiveCategory] = useState("All");

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    if (category === "All") {
      setFilteredProducts(products);
      return;
    }
    setFilteredProducts(products.filter((product) => product.category === category));
  }

  const categories = [
    "All",
    "Clothes",
    "Shoes",
    "Accessories",
  ];

  return (
    <div className="category-filter-bar">
      {categories.map((category) => (
        <button
          key={category}
          className={`category-filter ${activeCategory === category
              ? "category-filter--active"
              : ""
            }`}
          onClick={() => handleCategoryClick(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
}

export default CategoryFilterBar;