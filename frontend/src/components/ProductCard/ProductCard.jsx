import "./ProductCard.css";
import { HeartIcon } from "../../assets/icons";
import { useWishlist } from "../../context/WishlistContext";

function ProductCard({ product, onClick }) {
  const { name, status, price } = product;
  const { toggleWishlist, isInWishlist } = useWishlist();
  const isSaved = isInWishlist(product.id);

  function handleWishlistClick(event) {
    event.stopPropagation();
    toggleWishlist(product.id);
  }

  return (
    <article className="product-card" onClick={onClick}>
      <div className="product-card__image">
        {product.image_path && (
          <img
            src={`http://localhost:3000${product.image_path}`}
            alt={name}
          />
        )}

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

      <div className="product-card__info">
        <h3 className="product-card__name">{name}</h3>

        <p className="product-card__price">${price}</p>

        <span
          className={`product-card__status product-card__status--${status.toLowerCase()}`}
        >
          {status}
        </span>
      </div>
    </article>
  );
}

export default ProductCard;