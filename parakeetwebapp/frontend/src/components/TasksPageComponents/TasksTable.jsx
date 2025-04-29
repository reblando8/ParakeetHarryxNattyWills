import React, { useEffect, useState } from 'react';

const TasksTable = ({ currentUser }) => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    // Simulate fetching tasks based on currentUser
    const fetchTasks = async () => {
      // Replace with real fetch logic
      const mockTasks = [
        { title: 'Buy groceries', dueDate: '2025-03-22', priority: 'High' },
        { title: 'Finish project', dueDate: '2025-03-24', priority: 'Medium' },
      ];

      // Filter or fetch based on currentUser.id or username
      if (currentUser) {
        setTasks(mockTasks);
      }
    };

    fetchTasks();
  }, [currentUser]);

  return (
    <div className="p-4 overflow-x-auto rounded-lg shadow-md bg-white w-full m-0">
      <h2 className="text-lg font-semibold mb-4">Tasks for {currentUser?.username}</h2>
      <table className="min-w-full text-sm text-left border border-gray-300">
        <thead className="bg-gray-100 text-gray-700 uppercase">
          <tr>
            <th className="px-4 py-2 border-b">Title</th>
            <th className="px-4 py-2 border-b">Due Date</th>
            <th className="px-4 py-2 border-b">Priority</th>
          </tr>
        </thead>
        <tbody>
          {tasks.length === 0 ? (
            <tr>
              <td colSpan="3" className="px-4 py-3 text-center text-gray-500">
                No tasks available.
              </td>
            </tr>
          ) : (
            tasks.map((task, idx) => (
              <tr key={idx} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{task.title}</td>
                <td className="px-4 py-2">{task.dueDate}</td>
                <td className="px-4 py-2">{task.priority}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TasksTable;
