import { useEffect, useState } from "react";
import "./ProductForm.css";
import { getProductImageUrl } from "../../../utils/productImage";

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
          ? getProductImageUrl(product.image_path)
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

  useEffect(() => {
    return () => {
      if (imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function handleImageChange(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be 5 MB or smaller");
      event.target.value = "";
      return;
    }

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Only JPEG, PNG, and WebP images are allowed");
      event.target.value = "";
      return;
    }

    setError("");
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      let imagePath = product?.image_path || null;

      if (image) {
        const signResponse = await fetch("/api/uploads/sign", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            filename: image.name,
            contentType: image.type,
          }),
        });

        const signData = await signResponse.json();

        if (!signResponse.ok) {
          throw new Error(
            signData.message || "Could not prepare image upload",
          );
        }

        const uploadResponse = await fetch(signData.signedUrl, {
          method: "PUT",
          headers: {
            "Content-Type": image.type,
          },
          body: image,
        });

        if (!uploadResponse.ok) {
          throw new Error("Could not upload image to Supabase");
        }

        imagePath = signData.imagePath;
      }

      const url = isEditing
        ? `/api/products/${product.id}`
        : "/api/products";

      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          image_path: imagePath,
          price: formData.price === "" ? 0 : Number(formData.price),
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(
          responseData.message ||
          `Could not ${isEditing ? "update" : "create"} product`,
        );
      }

      onSuccess(responseData);
    } catch (err) {
      setError(err.message || "Could not connect to the server");
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
              <img src={imagePreview} alt="Product preview" />
            </div>
          )}
        </div>
      </div>

      {error && (
        <p className="product-form-error">{error}</p>
      )}

      <div className="product-form-actions">
        <button type="button" onClick={onCancel} disabled={loading}>
          Cancel
        </button>

        <button type="submit" disabled={loading}>
          {loading
            ? "Uploading and saving..."
            : isEditing
              ? "Save Changes"
              : "Add Product"}
        </button>
      </div>
    </form>
  );
}

export default ProductForm;
