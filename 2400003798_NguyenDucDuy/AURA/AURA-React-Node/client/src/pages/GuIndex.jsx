import { useEffect, useState } from 'react';
import { api } from '../api/client';
import ProductGrid from '../components/ProductGrid';
import Pagination from '../components/Pagination';

export default function GuIndex() {
  const [page, setPage] = useState(1);
  const [result, setResult] = useState(null);

  useEffect(() => {
    api(`/products?loaiSP=TrangChu&page=${page}&pageSize=24`)
      .then(setResult)
      .catch(console.error);
  }, [page]);

  return (
    <div className="page">
      <h1>GU — Tất cả sản phẩm</h1>
      <p className="subtitle">Khám phá theo gu phong cách của bạn</p>
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
