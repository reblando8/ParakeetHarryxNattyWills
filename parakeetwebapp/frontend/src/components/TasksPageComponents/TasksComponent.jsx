import React from "react";
import TasksLeftComponent from "./TasksLeftComponent";
import TasksMainComponent from "./TasksMainComponent";

export default function TasksComponent({ currentUser }) {
    return (
        <div className="flex w-screen h-screen">
            <TasksLeftComponent currentUser={currentUser} />
            <div className="flex-1">
                <TasksMainComponent currentUser={currentUser} />
            </div>
        </div>
    );
}