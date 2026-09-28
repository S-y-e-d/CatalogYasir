import { AboutIcon, HeartIcon, HomeIcon } from "../../assets/icons";
import "./NavbarBottom.css";

function NavbarBottom() {
  return (
    <nav className="mobile-bottom-nav">
      <button className="mobile-bottom-nav__item mobile-bottom-nav__item--active">
        <span className="mobile-bottom-nav__icon"><HomeIcon /></span>
      </button>

      <button className="mobile-bottom-nav__item">
        <span className="mobile-bottom-nav__icon"><HeartIcon /></span>
      </button>

      <button className="mobile-bottom-nav__item">
        <span className="mobile-bottom-nav__icon"><AboutIcon /></span>
      </button>
    </nav>
  );
}

export default NavbarBottom;