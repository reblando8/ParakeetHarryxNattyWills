import React from "react";

/*
    In theory this would hold basic notifications information for the user
    just so they have something to click to when they get on the page
*/

export default function NotificationsCardHomePage() {
    return (
        <div className="flex justify-start pt-4">
            <div className="bg-white border border-gray-300 shadow-md rounded-lg p-3 h-[200px] flex flex-col justify-between items-start">
                
                {/* Notification Title */}
                <h3 className="text-lg text-gray-700 font-semibold text-center">Notifications</h3>

                {/* Notification List */}
                <ul className="border-t pt-2 text-sm space-y-1">
                    <li className="flex justify-between text-gray-700">
                        <span>Notification Count: </span>
                        <span className="font-bold">30</span>
                    </li>
                </ul>
            </div>
        </div>
    );
}
