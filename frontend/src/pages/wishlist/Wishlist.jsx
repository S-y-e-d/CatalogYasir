import { useEffect, useState } from "react";
import { useWishlist } from "../../context/WishlistContext";
import ProductCard from "../../components/ProductCard/ProductCard";
import ProductModal from "../../components/ProductModal/ProductModal";
import "./Wishlist.css";

function Wishlist() {
  const { wishlist } = useWishlist();
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
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
      } catch {
        setError("Could not load wishlist products");
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  const wishlistProducts = products.filter((product) =>
    wishlist.some((id) => String(id) === String(product.id)),
  );

  return (
    <div className="wishlist">
      <h1>My Wishlist</h1>

      {loading && <p>Loading wishlist...</p>}

      {error && <p>{error}</p>}

      {!loading && !error && wishlistProducts.length === 0 && (
        <p className="wishlist-empty">
          Your wishlist is empty. Add items by clicking the heart.
        </p>
      )}

      {!loading && !error && wishlistProducts.length > 0 && (
        <div className="product-grid">
          {wishlistProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={() => setSelectedProduct(product)}
            />
          ))}
        </div>
      )}

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}

export default Wishlist;