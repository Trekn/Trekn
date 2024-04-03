import { createSlice } from "@reduxjs/toolkit";
import { now } from "moment";

export const accountSlice = createSlice({
    name: "account",
    initialState: {
        data: {}
    },
    reducers: {
        setAccountData: (state: any, action: any) => {
            return state = { data: { ...action.payload }, lastFetch: now() };
        },
        clearAccountData: (state: any) => {
            return state = { data: {} };
        }
    },
});

export const { setAccountData, clearAccountData } = accountSlice.actions;

export default accountSlice.reducer;
