import "./ProductModal.css";
import { HeartIcon } from "../../assets/icons";
import { useWishlist } from "../../context/WishlistContext";

function ProductModal({ product, onClose }) {
  const { name, status, price } = product;
  const { toggleWishlist, isInWishlist } = useWishlist();
  const isSaved = isInWishlist(product.id);

  function handleWishlistClick() {
    toggleWishlist(product.id);
  }

  return (
    <div className="product-modal" onClick={onClose}>
      <div
        className="product-modal__content"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          className="product-modal__close"
          type="button"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>

        <div className="product-modal__image">
          {product.image_path && (
            <img
              src={`http://localhost:3000${product.image_path}`}
              alt={name}
            />
          )}
        </div>

        <div className="product-modal__info">
          <div className="product-modal__title-row">
            <h2 className="product-modal__name">{name}</h2>

            <button
              type="button"
              className={`wishlist-heart ${isSaved ? "wishlist-heart--active" : ""}`}
              onClick={handleWishlistClick}
              aria-label={
                isSaved ? "Remove from wishlist" : "Add to wishlist"
              }
              aria-pressed={isSaved}
            >
              <HeartIcon />
            </button>
          </div>

          <p className="product-modal__price">${price}</p>

          <span
            className={`product-modal__status product-modal__status--${status.toLowerCase()}`}
          >
            {status}
          </span>

          <div className="product-modal__description">
            <h3>Description</h3>

            <p>
              This is a sample product description. More
              information about the product can be placed
              here, including its features, materials, size,
              and other useful details.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductModal;