import { EStoreSlice } from "@/helper/constants";
import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: EStoreSlice.ApiError,
  initialState: {
    loaders: 0,
  },
  reducers: {
    addLoader: (state) => {
      state.loaders = state.loaders + 1;
    },
    removeLoader: (state) => {
      state.loaders = state.loaders - 1;
    },
  },
});

export const { addLoader, removeLoader } = uiSlice.actions;
export const { reducer: uiReducer } = uiSlice;
