import "./Home.css";
import { useEffect, useState } from "react";

import CategoryFilterBar from "../../components/CategoryFilterBar/CategoryFilterBar";
import ProductCard from "../../components/ProductCard/ProductCard";
import ProductModal from "../../components/ProductModal/ProductModal";

import BannerImage from "../../assets/banner.png";

function Home() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProduct, setSelectedProduct]  = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch(
          "http://localhost:3000/api/products",
        );

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();
        setProducts(data);
        setFilteredProducts(data);
      } catch {
        setError("Could not load products");
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  function handleProductClick(product) {
    setSelectedProduct(product);
  }

  function handleClose() {
    setSelectedProduct(null);
  }

  return (
    <div className="home">
      <div className="banner">
        <img src={BannerImage} alt="Banner" />
        <span className="banner-slogan">Timeless Fashion</span>
      </div>

      {!loading && !error && (
        <CategoryFilterBar
          setFilteredProducts={setFilteredProducts}
          products={products}
        />
      )}

      {loading && <p>Loading products...</p>}

      {error && <p>{error}</p>}

      {!loading && !error && (
        <div className="product-grid">
          {filteredProducts.map((product) => {
            return (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => handleProductClick(product)}
              />
            );
          })}
        </div>
      )}

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={handleClose}
        />
      )}
    </div>
  );
}

export default Home;