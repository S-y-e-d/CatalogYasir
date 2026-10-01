import { Link } from "react-router-dom";
import { UserIcon } from "../../assets/icons";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar__left">
        <button className="navbar__menu-button" aria-label="Open menu">
          ☰
        </button>

        <Link to="/" className="navbar__title">
          YA Enterprise
        </Link>
      </div>

      <div className="navbar__links">
        <Link to="/">Home</Link>
        <Link to="/wishlist">Wishlist</Link>
        <Link to="/about">About</Link>
      </div>

      <button className="navbar__profile" aria-label="Account">
        <span className="navbar__profile-icon">
          <UserIcon />
        </span>
      </button>
    </nav>
  );
}

export default Navbar;