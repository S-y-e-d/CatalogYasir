import { Route, Routes } from 'react-router-dom';
import './App.css';
import NavbarBottom from './components/NavbarBottom/NavbarBottom';
import Navbar from './components/NavbarTop/Navbar';

import About from './pages/about/About';
import Admin from './pages/admin/Admin';
import Home from './pages/home/Home';
import Wishlist from './pages/wishlist/Wishlist';

function App() {


  return (
    <>
      <Navbar />
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>

      <NavbarBottom />
    </>
  );
}

export default App
