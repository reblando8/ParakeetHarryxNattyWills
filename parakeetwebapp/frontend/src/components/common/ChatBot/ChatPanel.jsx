import React, { useState, useRef, useEffect } from 'react';
import { HiXMark, HiPaperAirplane } from 'react-icons/hi2';
import { HiChatBubbleLeftRight } from 'react-icons/hi2';

export default function ChatPanel({ isOpen, onClose }) {
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "Hi! I'm your search assistant. I can help you find athletes, answer questions about sports, or guide you through using the search filters. What would you like to know?",
            isBot: true,
            timestamp: new Date()
        }
    ]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const handleSendMessage = async () => {
        if (!inputText.trim()) return;

        const userMessage = {
            id: Date.now(),
            text: inputText.trim(),
            isBot: false,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputText('');
        setIsTyping(true);

        // Simulate bot response
        setTimeout(() => {
            const botResponse = getBotResponse(inputText.trim());
            const botMessage = {
                id: Date.now() + 1,
                text: botResponse,
                isBot: true,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, botMessage]);
            setIsTyping(false);
        }, 1000);
    };

    const getBotResponse = (userInput) => {
        const input = userInput.toLowerCase();
        
        if (input.includes('search') || input.includes('find')) {
            return "I can help you search for athletes! Use the search bar above to type names, or use the filters on the left to search by sport, position, location, or other criteria. Try searching for 'basketball' or 'soccer' to see athletes in those sports.";
        }
        
        if (input.includes('filter') || input.includes('sport') || input.includes('position')) {
            return "Great question! You can filter athletes by:\n• Sport (Basketball, Soccer, Football, etc.)\n• Position (Point Guard, Striker, etc.)\n• Location (City, State)\n• Team name\n• Education level\n• Experience level\n• Physical attributes (Height, Weight)\n\nJust use the filter panel on the left side of the screen!";
        }
        
        if (input.includes('profile') || input.includes('click')) {
            return "Yes! You can click on any athlete's profile card to view their full profile. This will show you their detailed information, posts, and more. Just click anywhere on the athlete's card in the search results.";
        }
        
        if (input.includes('history') || input.includes('recent')) {
            return "Your recent searches are saved and displayed on the right side of the screen. You can click on any previous search to quickly repeat it with the same filters. This makes it easy to find athletes you've searched for before!";
        }
        
        if (input.includes('help') || input.includes('how')) {
            return "I'm here to help! This platform helps you discover and connect with athletes. You can:\n\n1. Search by name using the search bar\n2. Filter by sport, position, location, etc.\n3. Click on profiles to view details\n4. Use your search history for quick access\n\nWhat specific feature would you like to learn about?";
        }
        
        return "I understand you're looking for help with the search feature. I can assist you with finding athletes, using filters, viewing profiles, or navigating the platform. What specific question do you have?";
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const formatTime = (date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className={`fixed inset-0 z-40 transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black bg-opacity-50"
                onClick={onClose}
            />
            
            {/* Chat Panel */}
            <div className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl transform transition-transform duration-300 ${
                isOpen ? 'translate-y-0' : 'translate-y-full'
            }`} style={{ height: '70vh' }}>
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                            <HiChatBubbleLeftRight className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900">Search Assistant</h3>
                            <p className="text-sm text-gray-500">Online</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <HiXMark className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ height: 'calc(70vh - 140px)' }}>
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                        >
                            <div
                                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                                    message.isBot
                                        ? 'bg-gray-100 text-gray-900'
                                        : 'bg-blue-600 text-white'
                                }`}
                            >
                                <p className="text-sm whitespace-pre-line">{message.text}</p>
                                <p className={`text-xs mt-1 ${
                                    message.isBot ? 'text-gray-500' : 'text-blue-100'
                                }`}>
                                    {formatTime(message.timestamp)}
                                </p>
                            </div>
                        </div>
                    ))}
                    
                    {isTyping && (
                        <div className="flex justify-start">
                            <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-2xl">
                                <div className="flex space-x-1">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-gray-200">
                    <div className="flex space-x-2">
                        <input
                            ref={inputRef}
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Ask me anything about searching for athletes..."
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button
                            onClick={handleSendMessage}
                            disabled={!inputText.trim()}
                            className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <HiPaperAirplane className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
