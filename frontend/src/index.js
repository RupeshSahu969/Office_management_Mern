import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./AuthContext/AuthContext";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <BrowserRouter
      future={{
        v7_startTransition: true,    // Enable the startTransition behavior for state updates
        v7_relativeSplatPath: true,   // Enable the updated relative route resolution for splat routes
      }}
    >
 
        <App />
   
    </BrowserRouter>
  </React.StrictMode>
);
