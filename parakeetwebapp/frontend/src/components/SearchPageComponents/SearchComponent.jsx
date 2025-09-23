import React, { useState } from "react";
import SearchLeftComponent from "./SearchLeftComponent";
import SearchRightComponent from "./SearchRightComponent";
import SearchCenterComponent from "./SearchCenterComponent";
import SideBar from "../common/SideBar";

export default function SearchComponent({currentUser}) {
    const [filters, setFilters] = useState({});

    const handleFiltersChange = (newFilters) => {
        setFilters(newFilters);
    };

    return (
        <div className="flex w-full h-screen">
            <div className="w-64 flex-none hidden md:block">
                <div className="w-full h-full">
                    <SideBar currentUser={currentUser} />
                </div>
            </div>
            <SearchLeftComponent onFiltersChange={handleFiltersChange}/>
            <SearchCenterComponent currentUser={currentUser} filters={filters}/>
            <SearchRightComponent/>    
        </div>
    )
}
