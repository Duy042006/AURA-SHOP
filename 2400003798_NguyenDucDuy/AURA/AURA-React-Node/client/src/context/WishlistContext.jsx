import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

const WishlistContext = createContext(null);

function storageKey(userId) {
  return userId ? `aura_wishlist_${userId}` : 'aura_wishlist_guest';
}

function readList(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || '[]');
  } catch {
    return [];
  }
}

export function WishlistProvider({ children }) {
  const { user } = useAuth();
  const key = storageKey(user?.id);
  const [items, setItems] = useState(() => readList(storageKey(null)));

  useEffect(() => {
    setItems(readList(key));
  }, [key]);

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(items));
  }, [items, key]);

  const productKey = (p) => `${p.maSP}::${p.loaiSP || 'TrangChu'}`;

  const isFavorite = (product) =>
    items.some((x) => productKey(x) === productKey(product));

  const toggle = (product) => {
    if (!product?.maSP) return false;
    const k = productKey(product);
    setItems((prev) => {
      if (prev.some((x) => productKey(x) === k)) {
        return prev.filter((x) => productKey(x) !== k);
      }
      return [
        ...prev,
        {
          maSP: product.maSP,
          loaiSP: product.loaiSP || 'TrangChu',
          tenSP: product.tenSP,
          hinhAnh: product.hinhAnh,
          gia: product.gia,
          giaGoc: product.giaGoc,
        },
      ];
    });
    return true;
  };

  const remove = (product) => {
    const k = productKey(product);
    setItems((prev) => prev.filter((x) => productKey(x) !== k));
  };

  return (
    <WishlistContext.Provider value={{ items, isFavorite, toggle, remove }}>
      {children}
    </WishlistContext.Provider>
  );
}

const emptyWishlist = {
  items: [],
  isFavorite: () => false,
  toggle: () => false,
  remove: () => {},
};

export const useWishlist = () => useContext(WishlistContext) || emptyWishlist;
