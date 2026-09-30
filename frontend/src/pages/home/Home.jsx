import './Home.css'
import { useState } from 'react';

import CategoryFilterBar from '../../components/categoryFilterBar/CategoryFilterBar';
import ProductCard from '../../components/ProductCard/ProductCard';
import ProductModal from '../../components/productModal/ProductModal';

import BannerImage from '../../assets/banner.png';

import Sweater from '../../assets/sweater.png';
import Lower from '../../assets/lower.png';
import Scarf from '../../assets/scarf.png';
import Beanie from '../../assets/beanie.png';

function Home() {
  const [selectedProduct, setSelectedProduct] = useState(null);

  function handleProductClick(product) {
    setSelectedProduct(product);
  }

  function handleClose() {
    setSelectedProduct(null);
  }

  const products_sample = [
    { name: "Sweater", img: Sweater, status: "available", price: 49, category: "clothes" },
    { name: "Lower", img: Lower, status: "available", price: 39, category: "clothes" },
    { name: "Scarf", img: Scarf, status: "limited", price: 29, category: "accessories" },
    { name: "Beanie", img: Beanie, status: "unavailable", price: 19, category: "accessories" },

    { name: "Sweater", img: Sweater, status: "available", price: 49, category: "clothes" },
    { name: "Lower", img: Lower, status: "available", price: 39, category: "clothes" },
    { name: "Scarf", img: Scarf, status: "limited", price: 29, category: "accessories" },
    { name: "Beanie", img: Beanie, status: "unavailable", price: 19, category: "accessories" },
  ]
  const [products, setProducts] = useState(products_sample);

  return (
    <div className="home">
      <div className='banner'>
        <img src={BannerImage} alt="Banner" />
        <span className="banner-slogan">Timeless Fashion</span>
      </div>
      <CategoryFilterBar setProducts={setProducts} products_sample={products_sample}/>
      <div className="product-grid">
        {
          products.map((product) => {
            return <ProductCard
              key={Math.random()}
              product={product}
              onClick={() => handleProductClick(product)}
            />
          })
        }
      </div>
      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={handleClose} />
      )}

    </div>
  );
}

export default Home;
