// typescript applied
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type ThemeType = "dark" | "light";

interface ThemeState {
    themeMode: ThemeType;
}

const initialState: ThemeState = {
    themeMode: "dark",
};


const themeSlice = createSlice({
    name: "theme",
    initialState,
    reducers: {
        setTheme: (state, action: PayloadAction<ThemeType>) => {
            state.themeMode = action.payload;
        },
    },
});

export const { setTheme } = themeSlice.actions;

export default themeSlice.reducer;