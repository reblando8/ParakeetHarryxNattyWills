import React from "react";

export default function SearchRightComponent({ history = [], onHistoryClick }) {
    const formatFilters = (filters) => {
        if (!filters) return '';
        const parts = [];
        if (filters.sport) parts.push(`sport:${filters.sport}`);
        if (filters.position) parts.push(`position:${filters.position}`);
        if (filters.location) parts.push(`location:${filters.location}`);
        if (filters.team) parts.push(`team:${filters.team}`);
        if (filters.education) parts.push(`education:${filters.education}`);
        if (filters.experience) parts.push(`experience:${filters.experience}`);
        if (filters.height) parts.push(`height:${filters.height}`);
        if (filters.weight) parts.push(`weight:${filters.weight}`);
        return parts.join(" · ");
    };

    return (
        <div className="w-1/4 bg-gray-50 border-l border-gray-200 h-screen overflow-y-auto">
            <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Searches</h2>
                <div className="space-y-2">
                    {history.length === 0 ? (
                        <div className="text-sm text-gray-500">No recent searches yet.</div>
                    ) : (
                        history.map((h) => (
                            <button
                                key={h.id}
                                className="w-full text-left p-2 bg-white rounded border cursor-pointer hover:bg-gray-50"
                                onClick={() => onHistoryClick && onHistoryClick(h)}
                            >
                                <div className="text-sm text-gray-900 font-medium truncate">{h.queryText || 'Filter-only search'}</div>
                                {h.filters && (
                                    <div className="text-xs text-gray-600 truncate">{formatFilters(h.filters)}</div>
                                )}
                            </button>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}
