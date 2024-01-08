import { createSlice } from "@reduxjs/toolkit";
const initialAuthState = {
  branches: [],
  isLogin: false,
  userName: "",
  randomKey: "",
  header: {
    areaName: "",
    zoneName: "",
    branchName: "",
  },
  initialLoad: true,
};
const Branch = createSlice({
  name: "branch",
  initialState: initialAuthState,
  reducers: {
    updateBranch(state, action) {
      state.branches = action.payload;
    },
    updateLoginStatus(state, action) {
      state.isLogin = action.payload;
    },
    updateUserName(state, action) {
      state.userName = action.payload;
    },
    updateHeaderBranchDetails(state, action) {
      const data = state.branches.find(
        (itm) => itm.branch_name === action.payload
      );
      state.header.areaName = data.area_name;
      state.header.zoneName = data.zone_name;
      state.header.branchName = data.branch_name;
    },
    updateInitialHeaderBranchDetails(state, action) {
      const data = state.branches.find(
        (itm) => itm.branch_name === action.payload
      );
      state.header.areaName = data?.area_name;
      state.header.zoneName = data?.zone_name;
      state.header.branchName = "";
    },
    updateInitialLoad(state, action) {
      state.initialLoad = action.payload;
    },
    resetHeaderValues(state, action) {
      state.header.areaName = "";
      state.header.branchName = "";
      state.header.zoneName = "";
      state.initialLoad = true;
    },
    updateRandomKey(state, action) {
      state.randomKey = action.payload;
    },
  },
});
export const BranchAction = Branch.actions;
export default Branch.reducer;
