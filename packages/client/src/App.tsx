import React from "react";
import RouteElement from '@/routes'
import store from '@/store';
import { Provider } from "react-redux";
import './App.less'

export default function App() {
  return (
    <div className="entry-container">
      <Provider store={store}>
        <RouteElement />
      </Provider>
    </div>
  );
}
