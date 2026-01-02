import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { HiXMark, HiPaperAirplane } from 'react-icons/hi2';
import { HiChatBubbleLeftRight } from 'react-icons/hi2';
import { analyzeUserQuery, generateSearchSummary, getAthleteInfo } from '../../../api/OpenAiAPI';
import { analyzeUserQueryWithRAG, performRAGSearch, getEnhancedAthleteInfo, initializeRAG } from '../../../api/RAGService';
import { searchUsers, saveSearchHistory } from '../../../api/FirestoreAPI';
import ChatProfileCard from './ChatProfileCard';

export default function ChatPanel({ isOpen, onClose, onSearchRequest, currentFilters, onProfileClick }) {
    const currentUser = useSelector((state) => state.auth.user);
    
    const getUserName = () => {
        if (currentUser?.name) return currentUser.name;
        if (currentUser?.userName) return currentUser.userName;
        return 'there';
    };

    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [recentSearchResults, setRecentSearchResults] = useState([]);
    const [ragInitialized, setRagInitialized] = useState(false);
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
                    text: `Hi ${getUserName()}! I'm your AI-powered search assistant. I can help you find athletes, answer questions about sports, or guide you through using the search filters. I have access to detailed athlete information to provide more personalized recommendations. What would you like to know?`,
                    isBot: true,
                    timestamp: new Date()
                }
            ]);
        }
    }, [isOpen, currentUser]);

    // Initialize RAG when chat opens
    useEffect(() => {
        if (isOpen && !ragInitialized) {
            initializeRAGWithAthletes();
        }
    }, [isOpen, ragInitialized]);

    // Initialize RAG with athlete data
    const initializeRAGWithAthletes = async () => {
        try {
            console.log('Starting RAG initialization...');
            // Get some athlete data to initialize RAG
            const athletes = await searchUsers('', {}); // Get all athletes
            console.log('Found athletes for RAG:', athletes.length);
            
            if (athletes.length > 0) {
                console.log('Initializing RAG with first', Math.min(athletes.length, 50), 'athletes');
                await initializeRAG(athletes.slice(0, 50)); // Initialize with first 50 athletes
                setRagInitialized(true);
                console.log('RAG initialized successfully');
            } else {
                console.warn('No athletes found for RAG initialization');
            }
        } catch (error) {
            console.error('Error initializing RAG:', error);
            console.error('Error details:', error.message, error.stack);
        }
    };

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
            // Use RAG-enhanced analysis if available, fallback to regular analysis
            let analysis;
            console.log('RAG initialized:', ragInitialized);
            if (ragInitialized) {
                console.log('Using RAG-enhanced analysis');
                analysis = await analyzeUserQueryWithRAG(query, currentFilters || {}, recentSearchResults);
                console.log('RAG analysis result:', analysis);
            } else {
                console.log('Using basic analysis');
                analysis = await analyzeUserQuery(query, currentFilters || {});
            }
            
            console.log('Analysis action:', analysis.action);
            console.log('Analysis searchParams:', analysis.searchParams);
            
            if (analysis.action === 'SEARCH') {
                // Ensure searchParams exists
                if (!analysis.searchParams) {
                    console.warn('SEARCH action but no searchParams, adding defaults');
                    analysis.searchParams = {
                        query: '',
                        filters: {}
                    };
                }
                
                // Ensure filters is an object
                if (!analysis.searchParams.filters) {
                    analysis.searchParams.filters = {};
                }
                
                console.log('Processing SEARCH action with params:', analysis.searchParams);
                // Perform RAG-enhanced search if available
                let searchResults, summary;
                if (ragInitialized) {
                    console.log('Performing RAG search');
                    const ragSearchResult = await performRAGSearch(analysis.searchParams, currentFilters || {});
                    searchResults = ragSearchResult.searchResults;
                    console.log('RAG search returned:', searchResults?.length || 0, 'results');
                    summary = `Found ${searchResults.length} athletes matching your criteria. ${analysis.ragContext ? `\n\nBased on our database: ${analysis.ragContext}` : ''}`;
                } else {
                    console.log('Performing basic search');
                    // Fallback to regular search
                    searchResults = await searchUsers(
                        analysis.searchParams.query || '', 
                        analysis.searchParams.filters || {}
                    );
                    summary = await generateSearchSummary(searchResults, analysis.searchParams.query, analysis.searchParams.filters);
                }
                
                console.log('Final searchResults:', searchResults);
                console.log('SearchResults length:', searchResults?.length);
                
                // Store search results for athlete info queries
                setRecentSearchResults(searchResults);
                
                // Save search history
                if (currentUser?.id && analysis.searchParams) {
                    try {
                        await saveSearchHistory({
                            userID: currentUser.id,
                            queryText: analysis.searchParams.query || '',
                            filters: analysis.searchParams.filters || {}
                        });
                        console.log('Search history saved from chat:', {
                            query: analysis.searchParams.query,
                            filters: analysis.searchParams.filters
                        });
                    } catch (error) {
                        console.error('Error saving search history from chat:', error);
                    }
                }
                
                // Add the bot's response
                const botMessage = {
                    id: Date.now() + 1,
                    text: `${analysis.response}\n\n${summary}`,
                    isBot: true,
                    timestamp: new Date(),
                    searchResults: searchResults,
                    searchParams: analysis.searchParams,
                    ragContext: analysis.ragContext || null
                };
                console.log('Bot message with searchResults:', botMessage.searchResults?.length || 0);
                setMessages(prev => [...prev, botMessage]);
                
                // Trigger the search in the main component
                if (onSearchRequest) {
                    onSearchRequest(analysis.searchParams);
                }
            } else if (analysis.action === 'ATHLETE_INFO' && analysis.athleteName) {
                // Get enhanced athlete information if RAG is available
                let athleteInfo;
                if (ragInitialized) {
                    athleteInfo = await getEnhancedAthleteInfo(analysis.athleteName, recentSearchResults);
                } else {
                    athleteInfo = await getAthleteInfo(analysis.athleteName, recentSearchResults);
                }
                
                const botMessage = {
                    id: Date.now() + 1,
                    text: athleteInfo,
                    isBot: true,
                    timestamp: new Date(),
                    ragContext: analysis.ragContext || null
                };
                setMessages(prev => [...prev, botMessage]);
            } else {
                // Regular chat response with RAG context if available
                const responseText = analysis.ragContext ? 
                    `${analysis.response}\n\n*Based on our athlete database: ${analysis.ragContext}*` : 
                    analysis.response;
                
                const botMessage = {
                    id: Date.now() + 1,
                    text: responseText,
                    isBot: true,
                    timestamp: new Date(),
                    ragContext: analysis.ragContext || null
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

    const handleTellMeMore = async (user) => {
        const athleteName = user.name || user.userName || 'this athlete';
        const query = `Tell me about ${athleteName}`;
        
        // Add user message
        const userMessage = {
            id: Date.now(),
            text: query,
            isBot: false,
            timestamp: new Date()
        };
        setMessages(prev => [...prev, userMessage]);
        
        setIsTyping(true);
        
        try {
            // Get enhanced athlete information if RAG is available
            let athleteInfo;
            if (ragInitialized) {
                athleteInfo = await getEnhancedAthleteInfo(athleteName, recentSearchResults);
            } else {
                athleteInfo = await getAthleteInfo(athleteName, recentSearchResults);
            }
            
            const botMessage = {
                id: Date.now() + 1,
                text: athleteInfo,
                isBot: true,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error('Error getting athlete info:', error);
            const botMessage = {
                id: Date.now() + 1,
                text: "I'm having trouble getting detailed information about this athlete right now. Please try again.",
                isBot: true,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, botMessage]);
        } finally {
            setIsTyping(false);
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
                            <p className="text-sm text-gray-500">
                                {ragInitialized ? 'AI-Powered (RAG Active)' : 'Online'}
                            </p>
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
                        <div key={message.id}>
                            <div
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
                            
                            {/* Display search results as profile cards */}
                            {message.isBot && message.searchResults && message.searchResults.length > 0 && (
                                <div className="mt-3 ml-2">
                                    <div className="text-xs text-gray-500 mb-2 font-medium">
                                        Found {message.searchResults.length} athlete{message.searchResults.length !== 1 ? 's' : ''}:
                                    </div>
                                    <div className="space-y-2 max-h-60 overflow-y-auto">
                                        {message.searchResults.slice(0, 5).map((user, index) => (
                                            <ChatProfileCard 
                                                key={user.id || index} 
                                                user={user} 
                                                onProfileClick={onProfileClick}
                                                onTellMeMore={handleTellMeMore}
                                            />
                                        ))}
                                        {message.searchResults.length > 5 && (
                                            <div className="text-xs text-gray-500 text-center py-2">
                                                ... and {message.searchResults.length - 5} more results
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
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
