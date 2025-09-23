import React from "react";

export default function SearchLeftComponent() {
    return (
        <div className="w-80 bg-white border-r border-gray-200 h-screen overflow-y-auto">
            <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Search Filters</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Search Type</label>
                        <select className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="all">All</option>
                            <option value="users">Users</option>
                            <option value="posts">Posts</option>
                            <option value="comments">Comments</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                        <select className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="all">All Time</option>
                            <option value="today">Today</option>
                            <option value="week">This Week</option>
                            <option value="month">This Month</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                        <select className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="relevance">Relevance</option>
                            <option value="date">Date</option>
                            <option value="popularity">Popularity</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    )
}
