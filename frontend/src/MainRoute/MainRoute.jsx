import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../AuthContext/AuthContext";
import ProtectedRoute from "../AuthContext/ProtectedRoute";
import HrEmployees from "../Hr/HrEmployees"; 
import Login from "../Components/Login"; 
import Dashboard from "../Components/Dashboard"; 
import HrLeaves from "../Hr/HrLeaves"; 
import Leave from "../Employee/Leave";
import EmployeeForm from "../Employee/Employee";
import Attendance from "../Employee/Attendance";
import Project from "../Employee/Project";
import Task from "../Employee/Task";
import Notification from "../Employee/Notification";
import HrAttendance from "../Hr/HrAttendance";
import HrTasks from "../Hr/HrTasks";
import Register from "../Admin/Regisation";
import AdminEmployee from "../Admin/AdminEmployee";
import AdminUser from "../Admin/AdminUser";
import MyLeaves from "../Employee/MyLeaves";
import AllCount from "../Admin/AllCount";
import HrProject from "../Hr/HrProject";
import AdminProjectget from "../Admin/AdminProjectget";

const MainRoute = () => {
  const { isAuthenticated, role } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} />

      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}>
        {/* Admin Section - Default to Register */}
        {role === 'admin' && <Route path="/dashboard" element={<Navigate to="/dashboard/count" replace />} />}
        <Route path="/dashboard/count" element={<AllCount />} />
        <Route path="/dashboard/register" element={<Register />} />
        <Route path="/dashboard/admin/employee" element={<AdminEmployee />} />
        <Route path="/dashboard/admin/users" element={<AdminUser />} />
        <Route path="/dashboard/admin/project" element={<AdminProjectget />} />
        {/* HR Section - Default to HrEmployees */}
        {role === 'hr' && <Route path="/dashboard" element={<Navigate to="/dashboard/hr" replace />} />}

        <Route path="/dashboard/hr" element={<HrEmployees />} />
        <Route path="/dashboard/hr/tasks/:id" element={<HrTasks />} />
        <Route path="/dashboard/hr/leaves/:id" element={<HrLeaves />} />
        <Route path="/dashboard/hr/attendance/:id" element={<HrAttendance />} />
          <Route path="/dashboard/hr/project" element={<HrProject />} />

        {/* Employee Section - Default to EmployeeForm */}
        {role === 'employee' && <Route path="/dashboard" element={<Navigate to="/dashboard/employee" replace />} />}
        <Route path="/dashboard/employee" element={<EmployeeForm />} />
        <Route path="/dashboard/leave" element={<Leave />} />
        <Route path="/dashboard/attendance" element={<Attendance />} />
        <Route path="/dashboard/project" element={<Project />} />
        <Route path="/dashboard/notification" element={<Notification />} />
        <Route path="/dashboard/task" element={<Task />} />
          <Route path="/dashboard/my-leaves" element={<MyLeaves/>} />
           <Route path="/dashboard/project" element={<Project/>} />
      </Route>
    </Routes>
  );
};

export default MainRoute;
