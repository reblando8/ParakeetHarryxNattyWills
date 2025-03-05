import React from 'react';

export default function SubNotesCard() {
    const links = [
        { id: 1, text: "General information" },
        { id: 2, text: "Special abilities" },
        { id: 3, text: "Reference" },
        { id: 4, text: "Terms" },
        { id: 5, text: "Advertising Preferences" },
        { id: 6, text: "Advertising" },
        { id: 7, text: "Business Services" },
        { id: 8, text: "Download LinkedIn App" },
        { id: 9, text: "Yet" }
    ];

    return (
        <div className="bg-white rounded-lg shadow-sm p-4 w-1/2 mt-4">
            <div className="grid grid-cols-3 gap-2">
                {links.map((link) => (
                    <a
                        key={link.id}
                        href="#"
                        className="text-xs text-gray-500 hover:text-blue-600 hover:underline cursor-pointer"
                    >
                        {link.text}
                    </a>
                ))}
            </div>
            
            {/* Copyright text */}
            <div className="mt-4 text-xs text-gray-400">
                © 2024 Parakeet Corporation
            </div>
        </div>
    );
}
