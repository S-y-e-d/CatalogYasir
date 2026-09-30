import "./ProductModal.css";

function ProductModal({ product, onClose }) {
  const { name, img, status, price } = product;
  return (
    <div className="product-modal" onClick={onClose}>
      <div
        className="product-modal__content"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          className="product-modal__close"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>

        <div className="product-modal__image">
          {product.image_path && (
            <img
              src={`http://localhost:3000${product.image_path}`}
              alt={product.name}
            />
          )}
        </div>

        <div className="product-modal__info">
          <h2 className="product-modal__name">
            {name}
          </h2>

          <p className="product-modal__price">
            ${price}
          </p>

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