import { createContext, useContext, useState } from "react";

const WishlistContext = createContext(null);

const STORAGE_KEY = "wishlist";

function getSavedWishlist() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState(getSavedWishlist);

  function toggleWishlist(productId) {
    setWishlist((current) => {
      const exists = current.some(
        (id) => String(id) === String(productId),
      );

      const updated = exists
        ? current.filter((id) => String(id) !== String(productId))
        : [...current, productId];

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

      return updated;
    });
  }

  function isInWishlist(productId) {
    return wishlist.some(
      (id) => String(id) === String(productId),
    );
  }

  return (
    <WishlistContext.Provider
      value={{ wishlist, toggleWishlist, isInWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);

  if (!context) {
    throw new Error(
      "useWishlist must be used inside WishlistProvider",
    );
  }

  return context;
}