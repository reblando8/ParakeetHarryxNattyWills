// src/components/TextResult.jsx
import React from 'react';

const TextResult = ({ data }) => {
  return (
    <div className="text-gray-800">
      <p>{data}</p> {/* Render the text data here */}
    </div>
  );
};

export default TextResult;