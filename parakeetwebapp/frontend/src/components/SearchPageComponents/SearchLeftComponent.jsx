import React, { useState } from "react";

export default function SearchLeftComponent({ onFiltersChange }) {
    const [filters, setFilters] = useState({
        searchType: 'all',
        sport: '',
        position: '',
        location: '',
        team: '',
        education: '',
        experience: '',
        height: '',
        weight: ''
    });

    const handleFilterChange = (key, value) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
        if (onFiltersChange) {
            onFiltersChange(newFilters);
        }
    };

    const clearFilters = () => {
        const clearedFilters = {
            searchType: 'all',
            sport: '',
            position: '',
            location: '',
            team: '',
            education: '',
            experience: '',
            height: '',
            weight: ''
        };
        setFilters(clearedFilters);
        if (onFiltersChange) {
            onFiltersChange(clearedFilters);
        }
    };

    return (
        <div className="w-80 bg-white border-r border-gray-200 h-screen overflow-y-auto">
            <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">Search Filters</h2>
                    <button 
                        onClick={clearFilters}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                        Clear All
                    </button>
                </div>
                
                <div className="space-y-4">
                    {/* Search Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Search Type</label>
                        <select 
                            value={filters.searchType}
                            onChange={(e) => handleFilterChange('searchType', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">All</option>
                            <option value="users">Users</option>
                            <option value="posts">Posts</option>
                            <option value="comments">Comments</option>
                        </select>
                    </div>

                    {/* Sport */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Sport</label>
                        <select 
                            value={filters.sport}
                            onChange={(e) => handleFilterChange('sport', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">All Sports</option>
                            <option value="Soccer">Soccer</option>
                            <option value="Basketball">Basketball</option>
                            <option value="Football">Football</option>
                            <option value="Baseball">Baseball</option>
                            <option value="Tennis">Tennis</option>
                            <option value="Golf">Golf</option>
                            <option value="Swimming">Swimming</option>
                            <option value="Track & Field">Track & Field</option>
                            <option value="Volleyball">Volleyball</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    {/* Position */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
                        <input
                            type="text"
                            placeholder="e.g., Point Guard, Striker"
                            value={filters.position}
                            onChange={(e) => handleFilterChange('position', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Location */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                        <input
                            type="text"
                            placeholder="e.g., LA, New York, Chicago"
                            value={filters.location}
                            onChange={(e) => handleFilterChange('location', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Team */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Team</label>
                        <input
                            type="text"
                            placeholder="e.g., Golden State Warriors"
                            value={filters.team}
                            onChange={(e) => handleFilterChange('team', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Education */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Education</label>
                        <input
                            type="text"
                            placeholder="e.g., UC, Stanford, UCLA"
                            value={filters.education}
                            onChange={(e) => handleFilterChange('education', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Experience */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
                        <select 
                            value={filters.experience}
                            onChange={(e) => handleFilterChange('experience', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">All Experience Levels</option>
                            <option value="rookie">Rookie (0-1 years)</option>
                            <option value="junior">Junior (1-3 years)</option>
                            <option value="mid">Mid-level (3-5 years)</option>
                            <option value="senior">Senior (5-10 years)</option>
                            <option value="veteran">Veteran (10+ years)</option>
                        </select>
                    </div>

                    {/* Physical Attributes */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Height</label>
                            <input
                                type="text"
                                placeholder="e.g., 6'2"
                                value={filters.height}
                                onChange={(e) => handleFilterChange('height', e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Weight</label>
                            <input
                                type="text"
                                placeholder="e.g., 185lbs"
                                value={filters.weight}
                                onChange={(e) => handleFilterChange('weight', e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
