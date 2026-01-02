import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import SearchLeftComponent from "./SearchLeftComponent";
import SearchRightComponent from "./SearchRightComponent";
import SearchCenterComponent from "./SearchCenterComponent";
import SideBar from "../common/SideBar";
import ChatIcon from "../common/ChatBot/ChatIcon";
import ChatPanel from "../common/ChatBot/ChatPanel";
import { getRecentSearchHistory } from "../../api/FirestoreAPI";

export default function SearchComponent() {
    const currentUser = useSelector((state) => state.auth.user);
    const [filters, setFilters] = useState({});
    const [history, setHistory] = useState([]);
    const [externalSearchTrigger, setExternalSearchTrigger] = useState({ query: '', filters: null });
    const [isChatOpen, setIsChatOpen] = useState(false);

    console.log('SearchComponent currentUser from Redux:', currentUser);

    const loadHistory = async () => {
        console.log('Current user object:', currentUser);
        console.log('Current user ID:', currentUser?.id);
        if (currentUser?.id) {
            console.log('Loading search history for user:', currentUser.id);
            const list = await getRecentSearchHistory(currentUser.id, 10);
            console.log('Loaded search history:', list);
            setHistory(list);
        } else {
            console.log('No user ID found, cannot load search history');
        }
    };

    const handleFiltersChange = (newFilters) => {
        setFilters(newFilters);
    };

    useEffect(() => {
        loadHistory();
    }, [currentUser?.id]);

    // Also load history when currentUser object changes
    useEffect(() => {
        if (currentUser && Object.keys(currentUser).length > 0) {
            loadHistory();
        }
    }, [currentUser]);

    // Refresh history after each search
    const refreshHistory = () => {
        loadHistory();
    };

    const handleHistoryClick = (entry) => {
        const nextFilters = entry.filters || {};
        // Set filters first, then trigger search after a brief delay to avoid duplicate searches
        setFilters(nextFilters);
        setTimeout(() => {
            setExternalSearchTrigger({ query: entry.queryText || '', filters: nextFilters });
        }, 50);
    };

    const toggleChat = () => {
        setIsChatOpen(!isChatOpen);
    };

    const handleChatSearchRequest = (searchParams) => {
        // Update filters with the search parameters from chat
        if (searchParams.filters) {
            setFilters(searchParams.filters);
        }
        
        // Trigger search with the query and filters
        setExternalSearchTrigger({ 
            query: searchParams.query || '', 
            filters: searchParams.filters || {} 
        });
    };

    const handleProfileClick = (user) => {
        // Navigate to the user's profile
        window.location.href = `/profile/${user.id}`;
    };

    return (
        <div className="flex w-full h-screen relative">
            <div className="w-64 flex-none hidden md:block">
                <div className="w-full h-full">
                    <SideBar />
                </div>
            </div>
            <SearchLeftComponent onFiltersChange={handleFiltersChange}/>
            <SearchCenterComponent filters={filters} externalTrigger={externalSearchTrigger} onSearchComplete={refreshHistory}/>
            <SearchRightComponent history={history} onHistoryClick={handleHistoryClick}/>    
            
            {/* Chat Components */}
            <ChatIcon onClick={toggleChat} isOpen={isChatOpen} />
            <ChatPanel 
                isOpen={isChatOpen} 
                onClose={() => setIsChatOpen(false)} 
                onSearchRequest={handleChatSearchRequest}
                currentFilters={filters}
                onProfileClick={handleProfileClick}
            />
        </div>
    )
}
