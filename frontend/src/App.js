// src/App.js
import React from "react";
import { Routes, Route } from "react-router-dom";
import MainRoute from "./MainRoute/MainRoute";
import Dashboard from "./Components/Dashboard";
import { AuthProvider } from "./AuthContext/AuthContext";


function App() {
  return (
   <AuthProvider>
     <MainRoute/>
    </AuthProvider>
  );
}

export default App;
