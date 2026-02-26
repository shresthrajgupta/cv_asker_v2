// typescript applied
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { type userAccountInfoSuccessResponse } from "../async/usersApiSlice";

interface AuthState {
    userInfo: userAccountInfoSuccessResponse | null;
}

const initialState: AuthState = {
    userInfo: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (state, action: PayloadAction<userAccountInfoSuccessResponse>) => {
            state.userInfo = action.payload;
        },

        removeCredentials: (state) => {
            state.userInfo = null;
        },
    },
});

export const { setCredentials, removeCredentials } = authSlice.actions;

export default authSlice.reducer;