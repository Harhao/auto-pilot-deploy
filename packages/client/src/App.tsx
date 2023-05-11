import React from "react";
import RouteElement from '@/routes'
import { AuthProvider } from "./hooks/auth";
import './App.less'

export default function App() {
  return (
    <div className="entry-container">
      <AuthProvider>
        <RouteElement />
      </AuthProvider>
    </div>
  );
}
