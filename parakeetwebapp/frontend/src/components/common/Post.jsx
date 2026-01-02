import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import LikeButton from './LikeButton/LikeButton';
import { FaRegComment, FaRetweet, FaRegPaperPlane } from 'react-icons/fa';
import CommentDropDown from './Comments/CommentDropDown';

export default function Post({ posts, key }) {
    const outerCardClass = "bg-white border border-gray-300 shadow-md rounded-lg pb-0 pt-4 px-4 w-full min-h-[120px] h-auto"; 
    let navigate = useNavigate();
    const currentUser = useSelector((state) => state.auth.user);

    const [isOpen, setIsOpen] = useState(false);

    const handleToggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const goToRoute = (route, state) => {
        navigate(route, state);
    };

    const handleRepost = () => {
        // TODO: Implement repost functionality
        console.log('Repost clicked');
    };

    const handleSend = () => {
        // TODO: Implement send functionality
        console.log('Send clicked');
    };

    return (
        <div className="w-full my-6 max-w-4xl mx-auto" key={key}>
            <div className={outerCardClass}>
                {/* Name and Timestamp aligned properly */}
                <div className="text-gray-500 text-sm flex flex-col px-2">
                    <span 
                        className="font-semibold cursor-pointer text-gray-700 underline hover:text-blue-500"
                        onClick={() =>
                            goToRoute('/profile', {
                                state: {
                                    id: posts?.userID, 
                                    email: posts?.email
                                }
                            })
                        }
                    >
                        {posts.userName}
                    </span>
                    <span className="text-xs">{posts.timeStamp}</span>
                </div>

                {/* Status content */}
                <div className="w-full mt-4 px-2 break-words whitespace-normal text-gray-800">
                    {posts.status}
                </div>

                {/* Divider */}
                <div className="w-full h-[1px] bg-gray-200 mt-3 mb-2"></div>

                {/* Interaction Row */}
                <div className="flex justify-center items-center px-2 mb-1 gap-20">
                    <div 
                        onClick={handleToggleDropdown}
                    >
                        <LikeButton userID={currentUser?.id || currentUser?.userID} postID={posts.id} onClick={[handleToggleDropdown, () => console.log("should change")]} />
                    </div>
                    <button
                        onClick={handleToggleDropdown}
                        className="flex items-center gap-1 text-gray-500 hover:text-blue-500"
                    >
                        <FaRegComment size={16} /> {/* Replaced SVG with FaRegComment */}
                        <span className="text-sm">Comment</span>
                    </button>

                    <button
                        onClick={handleRepost}
                        className="flex items-center gap-1 text-gray-500 hover:text-green-500"
                    >
                        <FaRetweet size={16} />
                        <span className="text-sm">Repost</span>
                    </button>
                    <button
                        onClick={handleSend}
                        className="flex items-center gap-1 text-gray-500 hover:text-blue-500"
                    >
                        <FaRegPaperPlane size={16} />
                        <span className="text-sm">Send</span>
                    </button>
                </div>

                {/* Comment Section */} 
                {isOpen && (
                    <CommentDropDown 
                        isOpen={isOpen} 
                        postID={posts.id} 
                        userID={currentUser?.id || currentUser?.userID} 
                        userName={currentUser?.name || currentUser?.userName} 
                    />
                )}
            </div>
        </div>
    );
}