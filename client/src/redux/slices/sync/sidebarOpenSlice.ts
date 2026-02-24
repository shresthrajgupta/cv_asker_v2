// typescript applied
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type sidebarType = boolean;

interface sidebarState {
    sidebarOpen: sidebarType;
}

const initialState: sidebarState = {
    sidebarOpen: false
};


const sidebarOpenSlice = createSlice({
    name: "sidebarOpen",
    initialState,
    reducers: {
        setSidebarOpen: (state, action: PayloadAction<sidebarType>) => {
            state.sidebarOpen = action.payload;
        }
    }
});

export const { setSidebarOpen } = sidebarOpenSlice.actions;

export default sidebarOpenSlice.reducer;