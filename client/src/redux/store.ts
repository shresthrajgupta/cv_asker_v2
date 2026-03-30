// typescript applied
import { combineReducers, configureStore } from "@reduxjs/toolkit";

import { apiSlice } from "./slices/async/apiSlice";
import authSliceReducer from "./slices/sync/authSlice";
import accessTokenSliceReducer from "./slices/sync/accessTokenSlice";
import themeSliceReducer from "./slices/sync/themeSlice";
import sidebarOpenSliceReducer from "./slices/sync/sidebarOpenSlice";


const appReducer = combineReducers({
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authSliceReducer,
    theme: themeSliceReducer,
    accessToken: accessTokenSliceReducer,
    sidebarOpen: sidebarOpenSliceReducer,
})

const rootReducer = (state: any, action: any) => {
    if (action.type === "RESET_ALL") {
        state = undefined;
    }
    return appReducer(state, action);
};

const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: true,
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;