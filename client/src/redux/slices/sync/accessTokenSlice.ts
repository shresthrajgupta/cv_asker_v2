// typescript applied
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type AccessTokenType = string | null;

interface AccessTokenState {
    accessToken: AccessTokenType;
}

const initialState: AccessTokenState = {
    accessToken: null
};


const accessTokenSlice = createSlice({
    name: "accessToken",
    initialState,
    reducers: {
        setAccessToken: (state, action: PayloadAction<AccessTokenType>) => {
            state.accessToken = action.payload;
        },

        removeAccessToken: (state) => {
            state.accessToken = null;
        },
    }
});

export const { setAccessToken, removeAccessToken } = accessTokenSlice.actions;

export default accessTokenSlice.reducer;