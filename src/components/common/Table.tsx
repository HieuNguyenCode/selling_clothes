import React from 'react';
import Loading from './Loading';

export interface Column<T> {
  title: string;
  key: string;
  render?: (record: T, index: number) => React.ReactNode;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
}

interface TableProps<T> {
  columns: Column<T>[];
  dataSource: T[];
  loading?: boolean;
  rowKey?: keyof T | ((record: T) => string);
  emptyText?: string;
}

const Table = <T extends object>({ 
  columns, 
  dataSource, 
  loading = false, 
  rowKey = 'id' as keyof T,
  emptyText = 'Không có dữ liệu'
}: TableProps<T>) => {
  
  const getRowKey = (record: T, index: number) => {
    if (typeof rowKey === 'function') return rowKey(record);
    return (record[rowKey] as unknown as string) || index.toString();
  };

  return (
    <div style={{ overflowX: 'auto', width: '100%' }}>
      <table className="admin-table-v2">
        <thead>
          <tr>
            {columns.map((col, index) => (
              <th 
                key={col.key || index} 
                style={{ 
                  width: col.width, 
                  textAlign: col.align || 'left' 
                }}
              >
                {col.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columns.length}>
                <Loading size={32} />
              </td>
            </tr>
          ) : dataSource.length > 0 ? (
            dataSource.map((record, index) => (
              <tr key={getRowKey(record, index)}>
                {columns.map((col, colIndex) => (
                  <td 
                    key={colIndex} 
                    style={{ textAlign: col.align || 'left' }}
                  >
                    {col.render ? col.render(record, index) : (record[col.key as keyof T] as unknown as React.ReactNode)}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} style={{ textAlign: 'center', padding: '40px', color: '#8c8c8c' }}>
                {emptyText}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
