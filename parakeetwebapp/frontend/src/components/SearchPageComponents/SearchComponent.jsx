import React, { useState, useEffect } from "react";
import SearchLeftComponent from "./SearchLeftComponent";
import SearchRightComponent from "./SearchRightComponent";
import SearchCenterComponent from "./SearchCenterComponent";
import SideBar from "../common/SideBar";
import ChatIcon from "../common/ChatBot/ChatIcon";
import ChatPanel from "../common/ChatBot/ChatPanel";
import { getRecentSearchHistory } from "../../api/FirestoreAPI";

export default function SearchComponent({currentUser}) {
    const [filters, setFilters] = useState({});
    const [history, setHistory] = useState([]);
    const [externalSearchTrigger, setExternalSearchTrigger] = useState({ query: '', filters: null });
    const [isChatOpen, setIsChatOpen] = useState(false);

    console.log('SearchComponent received currentUser:', currentUser);

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
        setFilters(nextFilters);
        setExternalSearchTrigger({ query: entry.queryText || '', filters: nextFilters });
    };

    const toggleChat = () => {
        setIsChatOpen(!isChatOpen);
    };

    return (
        <div className="flex w-full h-screen relative">
            <div className="w-64 flex-none hidden md:block">
                <div className="w-full h-full">
                    <SideBar currentUser={currentUser} />
                </div>
            </div>
            <SearchLeftComponent onFiltersChange={handleFiltersChange}/>
            <SearchCenterComponent currentUser={currentUser} filters={filters} externalTrigger={externalSearchTrigger} onSearchComplete={refreshHistory}/>
            <SearchRightComponent history={history} onHistoryClick={handleHistoryClick}/>    
            
            {/* Chat Components */}
            <ChatIcon onClick={toggleChat} isOpen={isChatOpen} />
            <ChatPanel isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
        </div>
    )
}
