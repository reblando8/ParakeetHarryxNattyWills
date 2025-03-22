import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import LikeButton from './LikeButton/LikeButton';
import { getCurrentUserData } from '../../api/FirestoreAPI';
import { FaRegComment, FaRetweet, FaRegPaperPlane } from 'react-icons/fa';
import CommentDropDown from './Comments/CommentDropDown';
import Slider from "react-slick";

const NextArrow = ({ onClick }) => (
    <div
      onClick={onClick}
      className="absolute right-4 top-1/2 transform -translate-y-1/2 z-50 bg-orange-500 hover:bg-orange-600 text-white w-10 h-10 rounded-full flex items-center justify-center cursor-pointer"
    >
      ▶
    </div>
  );
  
  const PrevArrow = ({ onClick }) => (
    <div
      onClick={onClick}
      className="absolute left-4 top-1/2 transform -translate-y-1/2 z-50 bg-orange-500 hover:bg-orange-600 text-white w-10 h-10 rounded-full flex items-center justify-center cursor-pointer"
    >
      ◀
    </div>
  );

export default function Post({ posts, key }) {
    const outerCardClass = "bg-white border border-gray-300 shadow-md rounded-lg pb-0 pt-4 px-4 w-full min-h-[120px] h-auto"; 
    let navigate = useNavigate();

    const [isOpen, setIsOpen] = useState(false);

    const sliderSettings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />
    };

    const handleToggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const [currentUser, setCurrentUser] = useState({});
    useMemo(() => {
        getCurrentUserData(setCurrentUser);
    }, []);

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
                

        {posts.imageURLs?.length > 0 && (
          <div className="w-full mt-3 relative">
            {posts.imageURLs.length === 1 ? (
              <img
                src={posts.imageURLs[0]}
                alt="Post"
                className="w-full h-96 object-cover rounded-lg"
              />
            ) : (
              <Slider {...sliderSettings}>
                {posts.imageURLs.map((url, i) => (
                  <div key={i}>
                    <img
                      src={url}
                      alt={`Post image ${i}`}
                      className="w-full h-96 object-cover rounded-lg"
                    />
                  </div>
                ))}
              </Slider>
            )}
          </div>
        )}

                {/* Divider */}
                <div className="w-full h-[1px] bg-gray-200 mt-3 mb-2"></div>

                {/* Interaction Row */}
                <div className="flex justify-center items-center px-2 mb-1 gap-20">
                    <div 
                        onClick={handleToggleDropdown}
                    >
                        <LikeButton userID={currentUser?.id} postID={posts.id} onClick={[handleToggleDropdown, () => console.log("should change")]} />
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
                        userID={currentUser?.id} 
                        userName={currentUser?.name} 
                    />
                )}
            </div>
        </div>
    );
}