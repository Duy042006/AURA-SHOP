import { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext(null);
const KEY = 'aura_cart';

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(KEY) || '[]');
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (product, soLuong = 1) => {
    setItems((prev) => {
      const exist = prev.find(
        (x) => x.maSP === product.maSP && x.loaiSP === product.loaiSP
      );
      if (exist) {
        return prev.map((x) =>
          x.maSP === product.maSP && x.loaiSP === product.loaiSP
            ? { ...x, soLuong: x.soLuong + soLuong }
            : x
        );
      }
      return [
        ...prev,
        {
          maSP: product.maSP,
          loaiSP: product.loaiSP || 'TrangChu',
          tenSP: product.tenSP,
          hinhAnh: product.hinhAnh,
          gia: product.gia,
          soLuong,
        },
      ];
    });
  };

  const updateQty = (maSP, loaiSP, soLuong) => {
    setItems((prev) => {
      if (soLuong <= 0) return prev.filter((x) => !(x.maSP === maSP && x.loaiSP === loaiSP));
      return prev.map((x) =>
        x.maSP === maSP && x.loaiSP === loaiSP ? { ...x, soLuong } : x
      );
    });
  };

  const removeItem = (maSP, loaiSP) => {
    setItems((prev) => prev.filter((x) => !(x.maSP === maSP && x.loaiSP === loaiSP)));
  };

  const clear = () => setItems([]);

  const total = items.reduce((s, i) => s + i.gia * i.soLuong, 0);
  const count = items.reduce((s, i) => s + i.soLuong, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, updateQty, removeItem, clear, total, count }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
