import React from "react";
import TasksSideBar from "./TasksSideBar";

export default function HomeLeftComponent({ currentUser }) {
    return ( 
        <div className="w-64 flex-none hidden md:block">
            <div className="w-full">
                <TasksSideBar currentUser={currentUser} />
            </div>
        </div>
    );
}
