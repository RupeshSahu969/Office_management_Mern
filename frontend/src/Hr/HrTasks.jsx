import { useEffect, useState } from "react";
import { useAuth } from "../AuthContext/AuthContext";
import { useParams } from "react-router-dom";
import api from "../Api/Api";

const HrTasks = () => {
  const { token } = useAuth();
  const { id } = useParams();  // Get the employee ID from URL
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await api.get(`/hr/tasks/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        setTasks(res.data);
      } catch (err) {
        console.error("Error:", err.response?.data || err.message);
      }
    };

    if (token && id) {
      fetchTasks();
    }
  }, [token, id]);

  return (
    <div className="max-w-7xl mx-auto my-8 p-4">
      <h2 className="text-2xl font-semibold text-center mb-6">Tasks for Employee {id}</h2>

      <div className="overflow-x-auto shadow-md sm:rounded-lg">
        <ul className="space-y-4">
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <li key={task._id} className="border border-gray-300 p-4 rounded-lg hover:bg-gray-50">
                <div className="flex justify-between items-center">
                  <div className="text-lg font-semibold">{task.title}</div>
                  <span className={`px-3 py-1 rounded-full text-sm ${task.status === "Completed" ? "bg-green-500 text-white" : "bg-yellow-500 text-white"}`}>
                    {task.status}
                  </span>
                </div>
                <div className="text-sm text-gray-600 mt-2">
                  <strong>Description:</strong> {task.description}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  <strong>Due Date:</strong> {new Date(task.dueDate).toLocaleDateString()}
                </div>
              </li>
            ))
          ) : (
            <li className="text-center text-gray-500">No tasks found.</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default HrTasks;
