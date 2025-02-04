import React from 'react';

function HomePage() {
    return (
        <div className="home bg-gradient-to-r from-blue-500 to-teal-500 min-h-screen flex flex-col items-center justify-center text-white p-4">
            <h1 className="text-4xl font-bold mb-4">Welcome to Our Website</h1>
            <p className="text-lg mb-2">This is the homepage of our fantastic site where you can find various resources and information.</p>
            <p className="text-lg">Explore our site to learn more about what we offer!</p>
        </div>
    );
}

export default HomePage;