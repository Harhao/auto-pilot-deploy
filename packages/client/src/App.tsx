import React from "react";
import Routers from '@/routes'
import store from '@/store';
import { Provider } from "react-redux";

import './App.less'

export default function App() {
  return (
    <div className="entry-container">
      <Provider store={store}>
        <Routers />
      </Provider>
    </div>
  );
}
