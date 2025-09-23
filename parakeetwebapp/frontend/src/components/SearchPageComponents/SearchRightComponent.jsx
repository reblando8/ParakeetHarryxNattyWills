import React from "react";

export default function SearchRightComponent() {
    return (
        <div className="w-1/4 bg-gray-50 border-l border-gray-200 h-screen overflow-y-auto">
            <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Searches</h2>
                <div className="space-y-2">
                    <div className="p-2 bg-white rounded border cursor-pointer hover:bg-gray-50">
                        <p className="text-sm text-gray-700">#react</p>
                    </div>
                    <div className="p-2 bg-white rounded border cursor-pointer hover:bg-gray-50">
                        <p className="text-sm text-gray-700">javascript tips</p>
                    </div>
                    <div className="p-2 bg-white rounded border cursor-pointer hover:bg-gray-50">
                        <p className="text-sm text-gray-700">@john_doe</p>
                    </div>
                </div>
                
                <div className="mt-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Trending</h3>
                    <div className="space-y-2">
                        <div className="p-2 bg-white rounded border cursor-pointer hover:bg-gray-50">
                            <p className="text-sm text-gray-700">#webdev</p>
                        </div>
                        <div className="p-2 bg-white rounded border cursor-pointer hover:bg-gray-50">
                            <p className="text-sm text-gray-700">#frontend</p>
                        </div>
                        <div className="p-2 bg-white rounded border cursor-pointer hover:bg-gray-50">
                            <p className="text-sm text-gray-700">#reactjs</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
