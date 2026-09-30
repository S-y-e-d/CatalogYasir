import { useState } from "react";
import "./CategoryFilterBar.css";

function CategoryFilterBar( {setProducts, products_sample} ) {
  const [activeCategory, setActiveCategory] = useState("all");

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    if (category === "all") {
      setProducts(products_sample);
      return;
    }
    setProducts(products_sample.filter((product) => product.category === category));
  }

  const categories = [
    "all",
    "clothes",
    "shoes",
    "accessories",
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
          onClick={() => handleCategoryClick(category)}
        >
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </button>
      ))}
    </div>
  );
}

export default CategoryFilterBar;