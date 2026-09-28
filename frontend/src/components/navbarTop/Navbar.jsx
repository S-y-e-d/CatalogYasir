import { UserIcon } from "../../assets/icons";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar__left">
        <button className="navbar__menu-button" aria-label="Open menu">
          ☰
        </button>

        <a href="#" className="navbar__title">
          Yasir Enterprise
        </a>
      </div>

      <div className="navbar__links">
        <a href="#">Home</a>
        <a href="#">Wishlist</a>
        <a href="#">About</a>
      </div>

      <button className="navbar__profile" aria-label="Account">
        <span className="navbar__profile-icon"><UserIcon/></span>
      </button>
    </nav>
  );
}

export default Navbar;