import { createSlice } from "@reduxjs/toolkit";

const initialAuthState = {
  // time in seconds.
  defaultSessionTime: 0,
};
const SessionTimer = createSlice({
  name: "sessiontimer",
  initialState: initialAuthState,
  reducers: {
    updateDefaultSessionTime(state, action) {
      state.defaultSessionTime = action.payload;
    },
  },
});
export const SessionTimerAction = SessionTimer.actions;
export default SessionTimer.reducer;
