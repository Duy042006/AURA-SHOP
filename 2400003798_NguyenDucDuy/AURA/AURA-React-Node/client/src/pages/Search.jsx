import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../api/client';
import ProductGrid from '../components/ProductGrid';

export default function Search() {
  const [params] = useSearchParams();
  const keyword = params.get('keyword') || '';
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!keyword) {
      setProducts([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    api(`/products/search?keyword=${encodeURIComponent(keyword)}`)
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [keyword]);

  return (
    <div className="page">
      <h1>Tìm kiếm</h1>
      <p className="subtitle">
        Kết quả cho: <strong>{keyword}</strong> ({products.length} sản phẩm)
      </p>
      <ProductGrid products={products} loading={loading} />
    </div>
  );
}
