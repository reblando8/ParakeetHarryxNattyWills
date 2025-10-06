import React, { useState, useRef, useEffect } from 'react';
import { HiXMark, HiPaperAirplane } from 'react-icons/hi2';
import { HiChatBubbleLeftRight } from 'react-icons/hi2';
import { analyzeUserQuery, generateSearchSummary } from '../../../api/DeepSeekAPI';
import { searchUsers } from '../../../api/FirestoreAPI';

export default function ChatPanel({ isOpen, onClose, currentUser, onSearchRequest, currentFilters }) {
    const getUserName = () => {
        if (currentUser?.name) return currentUser.name;
        if (currentUser?.userName) return currentUser.userName;
        return 'there';
    };

    const [messages, setMessages] = useState([]);
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

    // Initialize with personalized greeting when chat opens
    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setMessages([
                {
                    id: 1,
                    text: `Hi ${getUserName()}! I'm your search assistant. I can help you find athletes, answer questions about sports, or guide you through using the search filters. What would you like to know?`,
                    isBot: true,
                    timestamp: new Date()
                }
            ]);
        }
    }, [isOpen, currentUser]);

    const handleSendMessage = async () => {
        if (!inputText.trim()) return;

        const userMessage = {
            id: Date.now(),
            text: inputText.trim(),
            isBot: false,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        const query = inputText.trim();
        setInputText('');
        setIsTyping(true);

        try {
            // Use DeepSeek API to analyze the query
            const analysis = await analyzeUserQuery(query, currentFilters || {});
            
            if (analysis.action === 'SEARCH' && analysis.searchParams) {
                // Perform the search
                const searchResults = await searchUsers(
                    analysis.searchParams.query || '', 
                    analysis.searchParams.filters || {}
                );
                
                // Generate a summary of the search results
                const summary = await generateSearchSummary(searchResults, analysis.searchParams.query, analysis.searchParams.filters);
                
                // Add the bot's response
                const botMessage = {
                    id: Date.now() + 1,
                    text: `${analysis.response}\n\n${summary}`,
                    isBot: true,
                    timestamp: new Date(),
                    searchResults: searchResults,
                    searchParams: analysis.searchParams
                };
                setMessages(prev => [...prev, botMessage]);
                
                // Trigger the search in the main component
                if (onSearchRequest) {
                    onSearchRequest(analysis.searchParams);
                }
            } else {
                // Regular chat response
                const botMessage = {
                    id: Date.now() + 1,
                    text: analysis.response,
                    isBot: true,
                    timestamp: new Date()
                };
                setMessages(prev => [...prev, botMessage]);
            }
        } catch (error) {
            console.error('Error processing message:', error);
            // Fallback to basic response
            const botMessage = {
                id: Date.now() + 1,
                text: "I'm having trouble processing your request right now. Please try again or use the search filters directly.",
                isBot: true,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, botMessage]);
        } finally {
            setIsTyping(false);
        }
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
