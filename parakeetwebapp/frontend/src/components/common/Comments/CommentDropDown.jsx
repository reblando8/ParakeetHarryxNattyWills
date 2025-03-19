import React, { useState, useEffect } from "react";
import { addComment, deleteComment, listenForComments } from '../../../api/FirestoreAPI';

export default function CommentDropDown({ onAddComment, isOpen = false, postID, userID, userName }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  // Fetch comments in real-time when dropdown is open
  useEffect(() => {
    if (isOpen) {
      const unsubscribe = listenForComments(postID, setComments);
      return () => unsubscribe(); // Cleanup listener
    }
  }, [isOpen, postID]);

  const handleInputChange = (e) => {
    setNewComment(e.target.value);
  };

  const handleAddComment = async () => {
    if (newComment.trim() === "") return;
    await addComment(postID, userID, userName, newComment);
    setNewComment(""); // Clear input after adding
    if (onAddComment) onAddComment(); // Call optional parent function if provided
  };

  const handleDeleteComment = async (commentID) => {
    await deleteComment(postID, commentID);
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
