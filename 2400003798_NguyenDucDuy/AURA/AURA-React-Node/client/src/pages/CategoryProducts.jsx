import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../api/client';
import ProductGrid from '../components/ProductGrid';
import PriceFilter from '../components/PriceFilter';

export default function CategoryProducts({ loaiSP, catApi, titlePrefix }) {
  const { id } = useParams();
  const [dm, setDm] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ mau: '', gia: '' });

  useEffect(() => {
    api(`/categories/${catApi}/${id}`).then(setDm).catch(console.error);
  }, [id, catApi]);

  useEffect(() => {
    setLoading(true);
    const q = new URLSearchParams({
      loaiSP,
      maDM: id,
      page: 1,
      pageSize: 100,
    });
    if (filters.mau) q.set('mau', filters.mau);
    if (filters.gia) q.set('gia', filters.gia);
    api(`/products?${q}`)
      .then((r) => setProducts(r.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id, loaiSP, filters]);

  return (
    <div className="page">
      <h1>
        {titlePrefix}: {dm?.tenDM || '...'}
      </h1>
      <PriceFilter mau={filters.mau} gia={filters.gia} onChange={setFilters} />
      <ProductGrid products={products} loading={loading} />
    </div>
  );
}
