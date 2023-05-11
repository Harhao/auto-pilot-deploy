import { combineReducers } from '@reduxjs/toolkit';
import authReducers from './auth';

const rootReducer = combineReducers({
  auth: authReducers,
});


export default rootReducer;
