import { NavLink } from "react-router-dom";
import { AboutIcon, HeartIcon, HomeIcon } from "../../assets/icons";
import "./NavbarBottom.css";

function MobileBottomNav() {
  return (
    <nav className="mobile-bottom-nav">
      <NavLink
        to="/"
        className={({ isActive }) =>
          `mobile-bottom-nav__item ${
            isActive ? "mobile-bottom-nav__item--active" : ""
          }`
        }
      >
        <span className="mobile-bottom-nav__icon">
          <HomeIcon />
        </span>
      </NavLink>

      <NavLink
        to="/wishlist"
        className={({ isActive }) =>
          `mobile-bottom-nav__item ${
            isActive ? "mobile-bottom-nav__item--active" : ""
          }`
        }
      >
        <span className="mobile-bottom-nav__icon">
          <HeartIcon />
        </span>
      </NavLink>

      <NavLink
        to="/about"
        className={({ isActive }) =>
          `mobile-bottom-nav__item ${
            isActive ? "mobile-bottom-nav__item--active" : ""
          }`
        }
      >
        <span className="mobile-bottom-nav__icon">
          <AboutIcon />
        </span>
      </NavLink>
    </nav>
  );
}

export default MobileBottomNav;