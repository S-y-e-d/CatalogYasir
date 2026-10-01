import { useEffect, useState } from "react";
import "./ProductForm.css";

function ProductForm({ product, onCancel, onSuccess }) {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    status: "Available",
    description: "",
  });

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isEditing = Boolean(product);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        price: product.price ?? "",
        category: product.category || "",
        status: product.status || "Available",
        description: product.description || "",
      });

      setImage(null);

      setImagePreview(
        product.image_path
          ? `${product.image_path}`
          : "",
      );
    } else {
      setFormData({
        name: "",
        price: "",
        category: "",
        status: "Available",
        description: "",
      });

      setImage(null);
      setImagePreview("");
    }

    setError("");
  }, [product]);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function handleImageChange(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setImage(file);

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setLoading(true);

    const data = new FormData();

    data.append("name", formData.name);
    data.append("price", formData.price);
    data.append("category", formData.category);
    data.append("status", formData.status);
    data.append("description", formData.description);

    if (image) {
      data.append("image", image);
    }

    const url = isEditing
      ? `/api/products/${product.id}`
      : "/api/products";

    const method = isEditing ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        credentials: "include",
        body: data,
      });

      const responseData = await response.json();

      if (!response.ok) {
        setError(
          responseData.message ||
            `Could not ${isEditing ? "update" : "create"} product`,
        );
        return;
      }

      onSuccess(responseData);
    } catch {
      setError("Could not connect to the server");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      <div className="product-form-header">
        <h2>{isEditing ? "Edit Product" : "Add Product"}</h2>

        <p>
          {isEditing
            ? "Update the product information."
            : "Add a new product to your catalog."}
        </p>
      </div>

      <div className="product-form-fields">
        <div className="product-form-field">
          <label htmlFor="product-name">Name</label>

          <input
            id="product-name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Product name"
            required
          />
        </div>

        <div className="product-form-field">
          <label htmlFor="product-price">Price</label>

          <input
            id="product-price"
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            min="0"
            step="0.01"
            placeholder="0.00"
            required
          />
        </div>

        <div className="product-form-field">
          <label htmlFor="product-category">Category</label>

          <input
            id="product-category"
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="e.g. Clothes"
            required
          />
        </div>

        <div className="product-form-field">
          <label htmlFor="product-status">Status</label>

          <select
            id="product-status"
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="Available">Available</option>
            <option value="Limited">Limited</option>
            <option value="Unavailable">Unavailable</option>
          </select>
        </div>

        <div className="product-form-field product-form-field-full">
          <label htmlFor="product-description">Description</label>

          <textarea
            id="product-description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="5"
            placeholder="Describe the product..."
          />
        </div>

        <div className="product-form-field product-form-field-full">
          <label htmlFor="product-image">Image</label>

          <input
            id="product-image"
            type="file"
            name="image"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleImageChange}
          />

          {imagePreview && (
            <div className="product-form-image-preview">
              <img
                src={imagePreview}
                alt="Product preview"
              />
            </div>
          )}
        </div>
      </div>

      {error && (
        <p className="product-form-error">
          {error}
        </p>
      )}

      <div className="product-form-actions">
        <button type="button" onClick={onCancel} disabled={loading}>
          Cancel
        </button>

        <button type="submit" disabled={loading}>
          {loading
            ? isEditing
              ? "Saving..."
              : "Adding..."
            : isEditing
              ? "Save Changes"
              : "Add Product"}
        </button>
      </div>
    </form>
  );
}

export default ProductForm;