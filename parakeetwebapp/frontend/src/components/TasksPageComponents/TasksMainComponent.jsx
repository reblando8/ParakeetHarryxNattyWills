import React from "react";
import TasksTable from "./TasksTable";

export default function HomeCenterComponent({ currentUser }) {
    return (
        <div className="flex-1 p-1 min-w-[900px] w-full">
            <TasksTable currentUser={currentUser} />
        </div>
    );
}