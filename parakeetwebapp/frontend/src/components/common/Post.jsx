import React from 'react';
import { useNavigate } from 'react-router-dom';


export default function Post({ posts, key }) {
    const outerCardClass = "bg-white border border-gray-300 shadow-md rounded-lg p-4 w-full min-h-[120px] h-auto"; 

    let navigate = useNavigate();

    const goToRoute = (route, state) => {
        navigate(route, state);
    }

    return (
        <div className="w-full my-6 max-w-4xl mx-auto" key = {key}>
            <div className={outerCardClass}>
                {/* Name and Timestamp aligned properly */}
                <div className="text-gray-500 text-sm flex flex-col px-2">
                    <span 
                        className="font-semibold cursor-pointer text-gray-700 underline hover:text-blue-500"
                        onClick={() =>
                             goToRoute('/profile',
                                {
                                    state: {
                                        id: posts?.userID, 
                                        email: posts?.email
                                    }
                                }
                        )}
                    >
                        {posts.userName}
                    </span>
                    <span className="text-xs">{posts.timeStamp}</span>
                </div>

                {/* Status content */}
                <div className="w-full mt-4 px-2 break-words whitespace-normal text-gray-800">
                    {posts.status}
                </div>
            </div>
        </div>
    );
}

