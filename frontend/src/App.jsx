import './App.css'
import { useState } from 'react';
import CategoryFilterBar from './components/categoryFilterBar/CategoryFilterBar';
import NavbarBottom from './components/navbarBottom/NavbarBottom';
import Navbar from './components/navbarTop/Navbar';
import ProductCard from './components/ProductCard/ProductCard';
import ProductModal from './components/productModal/ProductModal';

import BannerImage from './assets/banner.png';

import Sweater from './assets/sweater.png';
import Lower from './assets/lower.png';
import Scarf from './assets/scarf.png';
import Beanie from './assets/beanie.png';

function App() {
  const [selectedProduct, setSelectedProduct] = useState(null);

  function handleProductClick(product) {
    setSelectedProduct(product);
  }

  function handleClose() {
    setSelectedProduct(null);
  }
  const products = [
    { name: "Sweater", img: Sweater, status: "available" },
    { name: "Lower", img: Lower, status: "available" },
    { name: "Scarf", img: Scarf, status: "limited" },
    { name: "Beanie", img: Beanie, status: "unavailable" },

    { name: "Sweater", img: Sweater, status: "available" },
    { name: "Lower", img: Lower, status: "available" },
    { name: "Scarf", img: Scarf, status: "limited" },
    { name: "Beanie", img: Beanie, status: "unavailable" },
  ]

  return (
    <>
      <Navbar />
      <div className="home">
        <div className='banner'>
          <img src={BannerImage} alt="Banner" />
          <span className="banner-slogan">Timeless Fashion</span>
        </div>
        <CategoryFilterBar />
        <div className="product-grid">
          {
            products.map((product) => {
              return <ProductCard
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
      <NavbarBottom />
    </>
  );
}

export default App
