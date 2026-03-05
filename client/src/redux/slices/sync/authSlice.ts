// typescript applied
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { type UserAccountInfoSuccessResponse } from "../async/usersApiSlice";

type AuthStateType = UserAccountInfoSuccessResponse | null;

interface AuthState {
    userInfo: UserAccountInfoSuccessResponse | null;
}

const initialState: AuthState = {
    userInfo: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (state, action: PayloadAction<AuthStateType>) => {
            state.userInfo = action.payload;
        },

        removeCredentials: (state) => {
            state.userInfo = null;
        },
    },
});

export const { setCredentials, removeCredentials } = authSlice.actions;

export default authSlice.reducer;