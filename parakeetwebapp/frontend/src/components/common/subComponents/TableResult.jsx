import React from 'react';

const TableResult = ({ data }) => {
  // Check if data is not empty and is an array
  if (!data || !Array.isArray(data) || data.length === 0) {
    return
  }

  // Assuming data is an array of objects
  const columns = Object.keys(data[0]); // Get the keys of the first object to use as table headers

  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-100">
        <tr>
          {columns.map((col) => (
            <th key={col} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {col}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {data.map((row, index) => (
          <tr key={index}>
            {columns.map((col) => (
              <td key={col} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {row[col]} {/* Render the cell data */}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TableResult;