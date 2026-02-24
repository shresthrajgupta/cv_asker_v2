// typescript applied
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { type userAccountInfoInterface } from "../async/usersApiSlice";

interface AuthState {
    userInfo: userAccountInfoInterface | null;
}

const initialState: AuthState = {
    userInfo: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (state, action: PayloadAction<userAccountInfoInterface>) => {
            state.userInfo = action.payload;
        },

        removeCredentials: (state) => {
            state.userInfo = null;
        },
    },
});

export const { setCredentials, removeCredentials } = authSlice.actions;

export default authSlice.reducer;