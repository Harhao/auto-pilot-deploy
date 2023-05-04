import React from "react";
import RouteElement from '@/routes'
import { AuthProvider } from "./hooks/auth";
import './App.scss'

export default function App() {
  return (
    <div className="entry-container">
      <AuthProvider>
        <RouteElement />
      </AuthProvider>
    </div>
  );
}
