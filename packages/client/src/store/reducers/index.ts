import { combineReducers } from '@reduxjs/toolkit';
import authReducers from './auth';
import routeListReducers from './route';

const rootReducer = combineReducers({
  auth: authReducers,
  routeList: routeListReducers
});


export default rootReducer;
