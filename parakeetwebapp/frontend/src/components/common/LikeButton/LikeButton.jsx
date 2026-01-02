import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { likePostAsync } from '../../../store/slices/postsSlice';
import { getLikesByPost, checkIfUserLikedPost } from '../../../api/FirestoreAPI';

export default function LikeButton({ 
  userID,
  postID,
  size = 'medium',
  className = ''
}) {
  const dispatch = useDispatch();
  const [likes, setLikes] = useState(0);
  const [isActive, setIsActive] = useState(false);

  // Get initial like count and set up real-time listener
  useEffect(() => {
    getLikesByPost(setLikes, postID);
  }, [postID]);

  // Check if user has liked the post
  useEffect(() => {
    if (userID && postID) {
      checkIfUserLikedPost(setIsActive, userID, postID);
    }
  }, [userID, postID]);

  const handleClick = async () => {
    if (!userID || !postID) return;
    setIsActive(!isActive);
    dispatch(likePostAsync({ userID, postID }));
  };

  const sizeClasses = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-base'
  };

  const iconSizes = {
    small: 12,
    medium: 16,
    large: 20
  };

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center gap-2 ${sizeClasses[size]} ${className} transition-all duration-200 ease-in-out`}
    >
      <motion.div 
        className="relative w-[20px] h-[20px] flex items-center justify-center"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isActive ? (
            <motion.div
              key="filled"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ 
                duration: 0.2,
                ease: "easeOut"
              }}
            >
              <FaHeart 
                className="text-red-500" 
                size={iconSizes[size]}
              />
            </motion.div>
          ) : (
            <motion.div
              key="outline"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ 
                duration: 0.2,
                ease: "easeOut"
              }}
            >
              <FaRegHeart 
                className="text-gray-400 transition-colors duration-200" 
                size={iconSizes[size]}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      <span className={`${isActive ? 'text-red-500' : 'text-gray-400'} transition-colors duration-200`}>
        {likes}
      </span>
    </button>
  );
}
