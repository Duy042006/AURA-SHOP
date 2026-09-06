import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import ProductGrid from '../components/ProductGrid';
import Pagination from '../components/Pagination';

export default function CategoryMenu({ loaiSP, base, title }) {
  const [page, setPage] = useState(1);
  const [result, setResult] = useState(null);
  const [cats, setCats] = useState([]);

  const catKey = loaiSP === 'Ao' ? 'ao' : loaiSP === 'Quan' ? 'quan' : 'phukien';

  useEffect(() => {
    api(`/categories/${catKey}`)
      .then((r) => setCats(r.cap1 || []))
      .catch(console.error);
  }, [catKey]);

  useEffect(() => {
    api(`/products?loaiSP=${loaiSP}&page=${page}&pageSize=20`)
      .then(setResult)
      .catch(console.error);
  }, [loaiSP, page]);

  return (
    <div className="page">
      <h1>{title}</h1>
      <div className="category-chips">
        {cats.map((c) => (
          <Link key={c.maDM} to={`${base}/danh-muc/${c.maDM}`} className="chip">
            {c.tenDM}
          </Link>
        ))}
      </div>
      <ProductGrid products={result?.data} loading={!result} />
      {result && (
        <Pagination
          currentPage={result.currentPage}
          totalPages={result.totalPages}
          onChange={setPage}
        />
      )}
    </div>
  );
}
