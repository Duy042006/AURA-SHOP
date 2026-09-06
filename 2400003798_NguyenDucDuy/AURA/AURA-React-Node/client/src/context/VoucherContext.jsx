import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './AuthContext';

const VoucherContext = createContext(null);

const CATALOG_KEY = 'aura_voucher_catalog';

const DEFAULT_VOUCHERS = [
  {
    code: 'AURA10',
    title: 'Giảm 10% đơn hàng',
    desc: 'Giảm 10% trên tổng giá trị đơn hàng.',
    type: 'percent',
    value: 10,
    minOrder: 0,
    minOrderLabel: 'Không giới hạn',
    discountLabel: '10%',
    expiry: '31/12/2026',
  },
  {
    code: 'FREESHIP',
    title: 'Miễn phí vận chuyển',
    desc: 'Miễn phí ship cho đơn từ 500.000đ.',
    type: 'freeship',
    value: 30000,
    minOrder: 500000,
    minOrderLabel: '500.000đ',
    discountLabel: 'Freeship',
    expiry: '31/12/2026',
  },
  {
    code: 'WELCOME50',
    title: 'Ưu đãi khách mới',
    desc: 'Giảm 50.000đ cho đơn từ 300.000đ.',
    type: 'fixed',
    value: 50000,
    minOrder: 300000,
    minOrderLabel: '300.000đ',
    discountLabel: '50.000đ',
    expiry: '30/06/2026',
  },
];

function storageKey(userId) {
  return `aura_vouchers_${userId || 'guest'}`;
}

function formatMinLabel(minOrder) {
  const n = Number(minOrder) || 0;
  if (n <= 0) return 'Không giới hạn';
  return `${n.toLocaleString('vi-VN')}đ`;
}

function formatDiscountLabel(type, value) {
  if (type === 'percent') return `${value}%`;
  if (type === 'freeship') return 'Freeship';
  return `${Number(value).toLocaleString('vi-VN')}đ`;
}

function normalizeVoucher(input) {
  const type = input.type || 'fixed';
  const value = Number(input.value) || 0;
  const minOrder = Number(input.minOrder) || 0;
  return {
    code: String(input.code || '')
      .trim()
      .toUpperCase(),
    title: String(input.title || '').trim(),
    desc: String(input.desc || '').trim(),
    type,
    value,
    minOrder,
    minOrderLabel: input.minOrderLabel || formatMinLabel(minOrder),
    discountLabel: input.discountLabel || formatDiscountLabel(type, value),
    expiry: String(input.expiry || '31/12/2026').trim(),
  };
}

function readCatalog() {
  try {
    const raw = localStorage.getItem(CATALOG_KEY);
    if (!raw) {
      const seed = DEFAULT_VOUCHERS.map((v) => ({ ...v }));
      localStorage.setItem(CATALOG_KEY, JSON.stringify(seed));
      return seed;
    }
    const list = JSON.parse(raw);
    return Array.isArray(list) ? list.map(normalizeVoucher) : DEFAULT_VOUCHERS.map((v) => ({ ...v }));
  } catch {
    return DEFAULT_VOUCHERS.map((v) => ({ ...v }));
  }
}

function writeCatalog(list) {
  localStorage.setItem(CATALOG_KEY, JSON.stringify(list));
}

function readVouchers(userId) {
  try {
    const raw = localStorage.getItem(storageKey(userId));
    if (!raw) return null;
    const list = JSON.parse(raw);
    return Array.isArray(list) ? list : null;
  } catch {
    return null;
  }
}

function writeVouchers(userId, list) {
  localStorage.setItem(storageKey(userId), JSON.stringify(list));
}

/** Đẩy mã mới vào mọi user đã có kho voucher (chưa có mã thì thêm) */
function distributeVoucherToUsers(voucher) {
  const keys = Object.keys(localStorage).filter((k) => k.startsWith('aura_vouchers_'));
  for (const key of keys) {
    try {
      const list = JSON.parse(localStorage.getItem(key) || '[]');
      if (!Array.isArray(list)) continue;
      if (list.some((v) => v.code === voucher.code)) continue;
      list.push({ ...voucher });
      localStorage.setItem(key, JSON.stringify(list));
    } catch {
      /* skip */
    }
  }
}

function removeVoucherFromAllUsers(code) {
  const keys = Object.keys(localStorage).filter((k) => k.startsWith('aura_vouchers_'));
  for (const key of keys) {
    try {
      const list = JSON.parse(localStorage.getItem(key) || '[]');
      if (!Array.isArray(list)) continue;
      localStorage.setItem(
        key,
        JSON.stringify(list.filter((v) => v.code !== code))
      );
    } catch {
      /* skip */
    }
  }
}

export function calcVoucherDiscount(voucher, orderTotal) {
  if (!voucher) return 0;
  if (Number(orderTotal) < Number(voucher.minOrder || 0)) return 0;
  if (voucher.type === 'percent') {
    return Math.round((Number(orderTotal) * Number(voucher.value)) / 100);
  }
  if (voucher.type === 'fixed' || voucher.type === 'freeship') {
    return Math.min(Number(voucher.value) || 0, Number(orderTotal) || 0);
  }
  return 0;
}

export function canUseVoucher(voucher, orderTotal) {
  if (!voucher) return false;
  return Number(orderTotal) >= Number(voucher.minOrder || 0);
}

export function VoucherProvider({ children }) {
  const { user } = useAuth();
  const userId = user?.id ?? null;
  const [vouchers, setVouchers] = useState([]);
  const [catalog, setCatalog] = useState(() => readCatalog());

  useEffect(() => {
    if (!userId) {
      setVouchers([]);
      return;
    }
    const saved = readVouchers(userId);
    if (saved) {
      setVouchers(saved);
    } else {
      const seed = readCatalog().map((v) => ({ ...v }));
      writeVouchers(userId, seed);
      setVouchers(seed);
    }
  }, [userId]);

  const persistUser = (next) => {
    setVouchers(next);
    if (userId) writeVouchers(userId, next);
  };

  const persistCatalog = (next) => {
    setCatalog(next);
    writeCatalog(next);
  };

  const consumeVoucher = (code) => {
    if (!code || !userId) return;
    persistUser(vouchers.filter((v) => v.code !== code));
  };

  const getByCode = (code) => vouchers.find((v) => v.code === code) || null;

  /** Admin: thêm voucher vào catalog + phân phối cho user */
  const addCatalogVoucher = (input) => {
    const v = normalizeVoucher(input);
    if (!v.code || !v.title) {
      throw new Error('Vui lòng nhập mã và tiêu đề');
    }
    if (catalog.some((x) => x.code === v.code)) {
      throw new Error('Mã voucher đã tồn tại');
    }
    const next = [...catalog, v];
    persistCatalog(next);
    distributeVoucherToUsers(v);
    // Cập nhật list user hiện tại nếu là khách
    if (userId && user?.role !== 'Admin') {
      if (!vouchers.some((x) => x.code === v.code)) {
        persistUser([...vouchers, v]);
      }
    } else if (userId) {
      // admin cũng có key — bỏ qua
    }
    // reload customer list if same session is customer handled above
    return v;
  };

  const removeCatalogVoucher = (code) => {
    persistCatalog(catalog.filter((v) => v.code !== code));
    removeVoucherFromAllUsers(code);
    if (userId) {
      persistUser(vouchers.filter((v) => v.code !== code));
    }
  };

  const value = useMemo(
    () => ({
      vouchers,
      catalog,
      consumeVoucher,
      getByCode,
      calcVoucherDiscount,
      canUseVoucher,
      addCatalogVoucher,
      removeCatalogVoucher,
      refreshCatalog: () => setCatalog(readCatalog()),
    }),
    [vouchers, catalog, userId, user?.role]
  );

  return <VoucherContext.Provider value={value}>{children}</VoucherContext.Provider>;
}

const empty = {
  vouchers: [],
  catalog: [],
  consumeVoucher: () => {},
  getByCode: () => null,
  calcVoucherDiscount,
  canUseVoucher,
  addCatalogVoucher: () => {},
  removeCatalogVoucher: () => {},
  refreshCatalog: () => {},
};

export const useVouchers = () => useContext(VoucherContext) || empty;
