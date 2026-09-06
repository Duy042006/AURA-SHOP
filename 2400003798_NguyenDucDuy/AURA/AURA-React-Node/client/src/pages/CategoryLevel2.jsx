import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../api/client';
import ProductGrid from '../components/ProductGrid';

export default function CategoryLevel2({ loai, base }) {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loaiSP = loai === 'ao' ? 'Ao' : loai === 'quan' ? 'Quan' : 'PhuKien';

  useEffect(() => {
    setLoading(true);
    api(`/categories/${loai}/${id}`)
      .then(async (d) => {
        setData(d);
        const listDM = (d.dsMuc || []).map((x) => x.maDM);
        if (!listDM.length) {
          setProducts([]);
          return;
        }
        // Lấy tất cả SP của các danh mục con
        const r = await api(`/products?loaiSP=${loaiSP}&page=1&pageSize=100`);
        const filtered = (r.data || []).filter((p) => listDM.includes(p.maDM));
        setProducts(filtered);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id, loai, loaiSP]);

  return (
    <div className="page">
      <h1>{data?.dmCha?.tenDM || 'Danh mục'}</h1>
      <div className="category-chips">
        {data?.dsMuc?.map((m) => (
          <Link key={m.maDM} to={`${base}/san-pham/${m.maDM}`} className="chip">
            {m.tenDM}
          </Link>
        ))}
      </div>
      <ProductGrid products={products} loading={loading} />
    </div>
  );
}
