import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../api/client';
import ProductGrid from '../components/ProductGrid';
import PriceFilter from '../components/PriceFilter';

export default function GuProducts() {
  const { id } = useParams();
  const [nhom, setNhom] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ mau: '', gia: '' });

  useEffect(() => {
    api(`/categories/nhom/${id}`).then(setNhom).catch(console.error);
  }, [id]);

  useEffect(() => {
    setLoading(true);
    const q = new URLSearchParams({
      nhomID: id,
      page: 1,
      pageSize: 100,
    });
    if (filters.mau) q.set('mau', filters.mau);
    if (filters.gia) q.set('gia', filters.gia);
    api(`/products?${q}`)
      .then((r) => setProducts(r.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id, filters]);

  return (
    <div className="page">
      <h1>{nhom?.tenNhom || 'Nhóm sản phẩm'}</h1>
      <p className="subtitle">{nhom?.moTa || nhom?.noiDung}</p>
      <PriceFilter mau={filters.mau} gia={filters.gia} onChange={setFilters} />
      <ProductGrid products={products} loading={loading} />
    </div>
  );
}
