import React from 'react';
import logo from '../../images/ParakeetLogo.png'; // your default logo


export default function TasksSidebarItem({ imgSrc, label, onClick }) {
  return (
    <div 
      className="flex items-center space-x-3 text-gray-600 hover:text-black cursor-pointer p-2 rounded-lg hover:bg-gray-100"
      onClick={onClick}
    >
      <div className="w-8 h-8 rounded-full overflow-hidden">
        <img src={imgSrc || logo} alt={label} className="object-cover w-full h-full" />
      </div>
      <span className="font-medium">{label}</span>
    </div>
  );
}