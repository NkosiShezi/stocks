import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { Stocks } from "../../models";

interface stockState {
  loading: boolean;
  error: boolean;
  stocks: Stocks[];
}

const initialState = {
  loading: false,
  stocks: [],
  error: false,
} as stockState;

export const fetchStockData = createAsyncThunk(
  "stocks/fetchStockData",
  async (data, thunkApi) => {
    try {
      const data = await axios.get<Stocks[]>(
        `${process.env.NEXT_PUBLIC_API_URL}/Stocks`
      );
      return data.data;
    } catch (error: any) {
      return thunkApi.rejectWithValue(error.message);
    }
  }
);

const stockSlice = createSlice({
  name: "stock",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStockData.pending, (state) => {
        state.loading = true;
        state.error = false;
        state.stocks = [];
      })
      .addCase(
        fetchStockData.fulfilled,
        (state, action: PayloadAction<Stocks[]>) => {
          state.error = false;
          state.stocks = action.payload;
          state.loading = false;
        }
      )
      .addCase(fetchStockData.rejected, (state) => {
        state.error = true;
        state.loading = false;
        state.stocks = [];
      });
  },
});

export default stockSlice.reducer;
