import { useState } from 'react';
import { ChevronLeft, ChevronRight, Search, ArrowUpDown, Trash2, Edit, Eye } from 'lucide-react';

export default function DataTable({
  data = [],
  columns = [],
  onEdit,
  onDelete,
  onView,
  searchable = true,
  pageSize = 10,
  loading = false,
}) {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState({ key: null, direction: 'asc' });
  const [page, setPage] = useState(1);

  const filtered = searchable && search
    ? data.filter(row => columns.some(col => String(row[col.key] || '').toLowerCase().includes(search.toLowerCase())))
    : data;

  const sorted = sort.key
    ? [...filtered].sort((a, b) => {
        const aVal = a[sort.key] || '';
        const bVal = b[sort.key] || '';
        return sort.direction === 'asc' ? String(aVal).localeCompare(String(bVal)) : String(bVal).localeCompare(String(aVal));
      })
    : filtered;

  const totalPages = Math.ceil(sorted.length / pageSize) || 1;
  const paginated = sorted.slice((page - 1) * pageSize, page * pageSize);

  const toggleSort = (key) => {
    setSort(prev => ({ key, direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc' }));
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading...</div>;
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {searchable && (
        <div className="p-4 border-b border-gray-200">
          <div className="relative max-w-sm">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
            />
          </div>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {columns.map(col => (
                <th key={col.key} className="px-4 py-3 text-left font-semibold text-gray-700">
                  <button onClick={() => toggleSort(col.key)} className="flex items-center gap-1 hover:text-blue-600">
                    {col.label}
                    <ArrowUpDown size={14} />
                  </button>
                </th>
              ))}
              {(onEdit || onDelete || onView) && <th className="px-4 py-3 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {paginated.map((row, i) => (
              <tr key={row._id || i} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                {columns.map(col => (
                  <td key={col.key} className="px-4 py-3 text-gray-700">
                    {col.render ? col.render(row[col.key], row) : row[col.key] || '-'}
                  </td>
                ))}
                {(onEdit || onDelete || onView) && (
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {onView && <button onClick={() => onView(row)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"><Eye size={16} /></button>}
                      {onEdit && <button onClick={() => onEdit(row)} className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg"><Edit size={16} /></button>}
                      {onDelete && <button onClick={() => onDelete(row)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>}
                    </div>
                  </td>
                )}
              </tr>
            ))}
            {paginated.length === 0 && (
              <tr><td colSpan={columns.length + 1} className="px-4 py-8 text-center text-gray-400">No records found</td></tr>
            )}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
          <span className="text-sm text-gray-500">Page {page} of {totalPages}</span>
          <div className="flex gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50">
              <ChevronLeft size={16} />
            </button>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
