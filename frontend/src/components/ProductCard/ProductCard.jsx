import "./ProductCard.css";
import SampleProduct from '../../assets/sweater.png';

function ProductCard({ product, onClick }) {
  const { name, img, status, price, category } = product;
  return (
    <article className="product-card" onClick={onClick}>
      <div className="product-card__image">
        <img src={img} alt="product image" />
      </div>

      <div className="product-card__info">
        <h3 className="product-card__name">
          {name}
        </h3>

        <p className="product-card__price">
          ${price}
        </p> 

        <span className={`product-card__status product-card__status--${status}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>
    </article>
  );
}

export default ProductCard;