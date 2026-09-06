import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../api/client';
import ProductGrid from '../components/ProductGrid';

export default function GuNhom() {
  const { id } = useParams();
  const [tram, setTram] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api(`/categories/tram/${id}`)
      .then(async (t) => {
        setTram(t);
        const nhomIds = (t.nhoms || []).map((n) => n.nhomID);
        if (!nhomIds.length) {
          setProducts([]);
          return;
        }
        // Lấy SP theo từng nhóm
        const all = [];
        for (const nid of nhomIds) {
          const r = await api(`/products?nhomID=${nid}&page=1&pageSize=50`);
          all.push(...(r.data || []));
        }
        setProducts(all);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (!tram && loading) return <div className="loading">Đang tải...</div>;

  return (
    <div className="page">
      <h1>{tram?.tenTram || 'Trạm'}</h1>
      <p className="subtitle">{tram?.moTa}</p>

      <div className="category-chips">
        {tram?.nhoms?.map((n) => (
          <Link key={n.nhomID} to={`/gu/nhom/${n.nhomID}`} className="chip">
            {n.tenNhom}
          </Link>
        ))}
      </div>

      <ProductGrid products={products} loading={loading} />
    </div>
  );
}
