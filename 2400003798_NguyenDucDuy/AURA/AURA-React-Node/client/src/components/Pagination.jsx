export default function Pagination({ currentPage, totalPages, onChange }) {
  if (totalPages <= 1) return null;
  const pages = [];
  for (let i = 1; i <= totalPages; i++) pages.push(i);

  return (
    <div className="pagination">
      <button disabled={currentPage <= 1} onClick={() => onChange(currentPage - 1)}>
        ‹
      </button>
      {pages.map((p) => (
        <button
          key={p}
          className={p === currentPage ? 'active' : ''}
          onClick={() => onChange(p)}
        >
          {p}
        </button>
      ))}
      <button
        disabled={currentPage >= totalPages}
        onClick={() => onChange(currentPage + 1)}
      >
        ›
      </button>
    </div>
  );
}
