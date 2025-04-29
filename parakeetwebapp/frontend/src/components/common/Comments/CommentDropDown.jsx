import React, { useState, useEffect } from "react";
import { deleteCommentAsync, addCommentAsync, getComments } from '../../../redux/slices/postsSlice';
import { useDispatch, useSelector } from 'react-redux';

export default function CommentDropDown({ onAddComment, isOpen = false, postID, userID, userName }) {
  const [newComment, setNewComment] = useState("");
  const dispatch = useDispatch();
  const comments = useSelector(state => state.posts.comments[postID] || []);
  const loading = useSelector(state => state.posts.loading);
  const error = useSelector(state => state.posts.error);

  // Fetch comments when dropdown is opened
  useEffect(() => {
    if (isOpen) {
      dispatch(getComments({ postID }))
        .unwrap()
        .then(data => console.log("Fetched comments:", data))
        .catch(error => console.error('Failed to fetch comments:', error));
    }
  }, [isOpen, postID, dispatch]);

  const handleInputChange = (e) => {
    setNewComment(e.target.value);
  };

  const handleAddComment = async () => {
    if (newComment.trim() === "") return;
    try {
      await dispatch(addCommentAsync({ postID, userID, userName, text: newComment })).unwrap();
      setNewComment(""); // Clear input after adding
      dispatch(getComments({ postID })); // ✅ Refresh comments immediately
      if (onAddComment) onAddComment();
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  const handleDeleteComment = async (commentID) => {
    try {
      await dispatch(deleteCommentAsync({ postID, commentID })).unwrap();
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  };

  return (
    <div className="w-full">
      {isOpen && (
        <div className="w-full">
          {/* Comment Input */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newComment}
              onChange={handleInputChange}
              placeholder="Write a comment..."
              className="flex-1 border border-gray-200 rounded-full px-4 py-2 text-sm outline-none focus:border-blue-500"
            />
            <button
              onClick={handleAddComment}
              className="bg-blue-500 text-white text-sm px-4 py-2 rounded-full hover:bg-blue-600"
            >
              Post
            </button>
          </div>

          {/* Display Comments */}
          <div className="mt-2 space-y-2">
            {comments.map((c) => (
              <div
                key={c.id}
                className="flex justify-between items-center text-sm text-gray-700 bg-gray-50 p-3 rounded-2xl"
              >
                <span>
                  <span className="font-medium">{c.userName}: </span>
                  {c.text}
                </span>
                {c.userID === userID && (
                  <button
                    onClick={() => handleDeleteComment(c.id)}
                    className="text-red-500 text-xs hover:underline"
                  >
                    Delete
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
