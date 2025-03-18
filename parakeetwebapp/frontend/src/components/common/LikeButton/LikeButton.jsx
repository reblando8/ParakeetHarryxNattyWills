import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { likePost, getLikesByPost, checkIfUserLikedPost } from '../../../api/FirestoreAPI';

export default function LikeButton({ 
  userID,
  postID,
  size = 'medium',
  className = ''
}) {
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
    setIsActive(!isActive);
    await likePost(userID, postID);
  };

  const sizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg'
  };

  const iconSizes = {
    small: 16,
    medium: 20,
    large: 24
  };

  return (
    <motion.button
      onClick={handleClick}
      className={`flex items-center gap-2 ${sizeClasses[size]} ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="relative">
        <AnimatePresence mode="wait">
          {isActive ? (
            <motion.div
              key="filled"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ duration: 0.2 }}
            >
              <FaHeart 
                className="text-red-500" 
                size={iconSizes[size]}
              />
            </motion.div>
          ) : (
            <motion.div
              key="outline"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ duration: 0.2 }}
            >
              <FaRegHeart 
                className="text-gray-400 hover:text-red-500 transition-colors" 
                size={iconSizes[size]}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <span className={`${isActive ? 'text-red-500' : 'text-gray-400'}`}>
        {likes}
      </span>
    </motion.button>
  );
}
