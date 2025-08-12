'use client';

import { Column } from '@/types/Column';
import React from 'react';

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
}

export function DataTable<T>({ data, columns }: DataTableProps<T>) {
  return (
    <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-sm">
      <thead>
        <tr>
          {columns.map((col) => (
            <th
              key={String(col.key)}
              className="px-4 py-2 border-b bg-gray-100 text-left text-sm font-medium text-gray-700"
            >
              {col.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.length > 0 ? (
          data.map((item, idx) => (
            <tr key={idx} className="hover:bg-gray-50">
              {columns.map((col) => (
                <td
                  key={String(col.key)}
                  className="px-4 py-2 border-b text-sm text-gray-700"
                >
                  {col.render ? col.render(item) : String(item[col.key] ?? '')}
                </td>
              ))}
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={columns.length} className="text-center py-4 text-gray-500">
              Nenhum registro encontrado.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
