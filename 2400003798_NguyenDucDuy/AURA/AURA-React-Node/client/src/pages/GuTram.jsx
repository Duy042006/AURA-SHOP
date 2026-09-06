import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../api/client';
import ProductGrid from '../components/ProductGrid';

export default function GuTram() {
  const { id } = useParams();
  const [gu, setGu] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api(`/categories/gu/${id}`).then(setGu).catch(console.error);
    // Lấy sản phẩm liên quan (maDM gần với gu)
    api(`/products?loaiSP=TrangChu&page=1&pageSize=12`)
      .then((r) => setProducts(r.data || []))
      .catch(console.error);
  }, [id]);

  if (!gu) return <div className="loading">Đang tải...</div>;

  return (
    <div className="page">
      <h1>{gu.tenGu}</h1>
      <p className="subtitle">{gu.moTa}</p>

      <div className="category-chips">
        {gu.trams?.map((t) => (
          <Link key={t.tramID} to={`/gu/tram/${t.tramID}`} className="chip">
            {t.tenTram}
          </Link>
        ))}
      </div>

      <ProductGrid products={products} />
    </div>
  );
}
