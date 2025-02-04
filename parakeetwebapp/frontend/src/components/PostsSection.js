import React from 'react';

function PostsSection() {
    const posts = [
        "../images/post1.jpg",
        "../images/post2.jpg",
        "../images/post3.jpg",
    ];

    return (
        <div className="mt-4">
            <h2 className="text-lg font-semibold mb-2">Posts</h2>
            <div className="grid grid-cols-3 gap-4">
                {posts.map((post, index) => (
                    <img key={index} className="w-full h-64 object-cover rounded-lg" src={post} alt="Post" />
                ))}
            </div>
        </div>
    );
}

export default PostsSection;