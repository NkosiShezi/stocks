import { configureStore } from "@reduxjs/toolkit";

import stockSlice from "@/features/stock/stockSlice";

const store = configureStore({
  reducer: stockSlice,
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;
