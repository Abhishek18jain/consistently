import { combineReducers } from "@reduxjs/toolkit";

import authReducer from "../features/auth/auth.slice.js";
import journalReducer from "../features/journal/journal.slice.js";
import pageReducer from "../app/page.slice.js";
import analyticsReducer from "../features/dashboard/dashboard.slice.js";
import coachReducer from "../features/coach/coach.slice.js";

const rootReducer = combineReducers({
  auth: authReducer,
  journal: journalReducer,
  page: pageReducer,
  analytics: analyticsReducer,
  coach: coachReducer
});

export default rootReducer;
