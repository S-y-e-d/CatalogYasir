import "./ProductCard.css";

function ProductCard({ product, onClick }) {
  const { name, img, status, price, category } = product;
  return (
    <article className="product-card" onClick={onClick}>
      <div className="product-card__image">
        {product.image_path && (
          <img
            src={`http://localhost:3000${product.image_path}`}
            alt={product.name}
          />
        )}
      </div>

      <div className="product-card__info">
        <h3 className="product-card__name">
          {name}
        </h3>

        <p className="product-card__price">
          ${price}
        </p>

        <span className={`product-card__status product-card__status--${status.toLowerCase()}`}>
          {status}
        </span>
      </div>
    </article>
  );
}

export default ProductCard;