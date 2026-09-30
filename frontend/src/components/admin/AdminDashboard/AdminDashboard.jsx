import { useEffect, useState } from "react";
import ProductForm from "../ProductForm/ProductForm";
import "./AdminDashboard.css";

function AdminDashboard({ onLogout }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showProductForm, setShowProductForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  async function fetchProducts() {
    setError("");

    try {
      const response = await fetch("http://localhost:3000/api/products");

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await response.json();
      setProducts(data);
    } catch {
      setError("Could not load products");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  function handleAddProduct() {
    setSelectedProduct(null);
    setShowProductForm(true);
  }

  function handleEditProduct(product) {
    setSelectedProduct(product);
    setShowProductForm(true);
  }

  function handleCloseForm() {
    setShowProductForm(false);
    setSelectedProduct(null);
  }

  async function handleProductSaved() {
    handleCloseForm();
    setLoading(true);

    await fetchProducts();
  }

  async function handleDeleteProduct(product) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.name}"?`,
    );

    if (!confirmed) {
      return;
    }

    setError("");

    try {
      const response = await fetch(
        `http://localhost:3000/api/products/${product.id}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Could not delete product");
        return;
      }

      await fetchProducts();
    } catch {
      setError("Could not connect to the server");
    }
  }

  return (
    <div className="admin-dashboard">
      <header className="admin-dashboard-header">
        <div>
          <h1>Admin</h1>
          <p>Manage your products</p>
        </div>

        <button type="button" onClick={onLogout}>
          Log out
        </button>
      </header>

      <section className="admin-products">
        <div className="admin-section-header">
          <h2>Products</h2>

          <button type="button" onClick={handleAddProduct}>
            Add Product
          </button>
        </div>

        {loading && <p>Loading products...</p>}

        {error && <p>{error}</p>}

        {!loading && !error && products.length === 0 && (
          <p>No products yet.</p>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="admin-product-table">
            <div className="admin-table-header">
              <span>Product</span>
              <span>Category</span>
              <span>Price</span>
              <span>Status</span>
              <span>Actions</span>
            </div>

            {products.map((product) => (
              <div className="admin-product-row" key={product.id}>
                <div className="admin-product-name">
                  {product.image_path && (
                    <img
                      className="admin-product-image"
                      src={`http://localhost:3000${product.image_path}`}
                      alt=""
                    />
                  )}

                  <span>{product.name}</span>

                </div>

                <div>{product.category}</div>

                <div>€{product.price}</div>

                <div>
                  <span
                    className={`admin-status admin-status-${product.status.toLowerCase()}`}
                  >
                    {product.status}
                  </span>
                </div>

                <div className="admin-product-actions">
                  <button
                    type="button"
                    onClick={() => handleEditProduct(product)}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteProduct(product)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {showProductForm && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <button
              className="admin-modal-close"
              type="button"
              onClick={handleCloseForm}
              aria-label="Close"
            >
              ×
            </button>

            <ProductForm
              product={selectedProduct}
              onCancel={handleCloseForm}
              onSuccess={handleProductSaved}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;