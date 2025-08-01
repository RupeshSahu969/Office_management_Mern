import React, { useState } from 'react';
import { useAuth } from '../AuthContext/AuthContext'; // Assuming there's an auth context for user info
import api from '../Api/Api';

const Task = () => {
   const { token, id } = useAuth(); // Get the token and id details for authorization
    const [formdata,setFormData]=useState({
   title:"",
   description:"",
   dueDate: "",
   status: "",
  priority :""
  })
  const [assignedTo, setAssignedTo] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
 
const handleChange=(e)=>{

  const {name,value}=e.target;
  setFormData(prev=> ({
    ...prev,
    [name]:value
  }))

}


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    console.log(formdata)
    const taskData = {
       assignedTo: id,
        ...formdata
    };

    try {
      const res = await api.post('/tasks', taskData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Task created:', res.data);
      setIsSubmitting(false);
      setSuccess('Task successfully created!');
      setAssignedTo('');
      setFormData("")
    } catch (err) {
      setIsSubmitting(false);
      setError(err.response?.data?.error || 'An error occurred while creating the task.');
      console.error('Error response:', err.response?.data);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 border border-gray-200 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-6">Create New Task</h2>

      {/* Success and Error Messages */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
          <strong>Error: </strong> {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-md">
          <strong>Success: </strong> {success}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Assigned To */}
          <div className="mb-4">
             <label className="block text-gray-700">Priority</label>
            <select
            name='priority'
              value={formdata.priority}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md"
            >
              <option>select</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          {/* Task Title */}
          <div className="mb-4">
            <label className="block text-gray-700">Title</label>
            <input
              type="text"
              name="title"
  value={formdata.title}
  onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md"
              placeholder="Task Title"
              required
            />
          </div>
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block text-gray-700">Description</label>
          <textarea
           name="description"
            value={formdata.description}
            onChange={handleChange}
            // onChange={(e) => setFormData(e.target.value)}
            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md"
            placeholder="Task Description"
            rows="4"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="mb-4">
            <label className="block text-gray-700">Due Date</label>
            <input
              type="date"
              name='dueDate'
              value={formdata.dueDate}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Status</label>
            <select
             name='status'
              value={formdata.status}
              onChange={handleChange}
              // onChange={(e) => setFormData(e.target.value)}
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md"
            >
              <option>Select</option>
              <option value="not started">Not Started</option>
              <option value="in progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="on hold">On Hold</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Priority */}
          <div className="mb-4">
           
          </div>
        </div>

        {/* Submit Button */}
        <div className="mb-4">
          <button
            type="submit"
            className={`px-6 py-2 rounded-md ${isSubmitting ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Create Task'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Task;
