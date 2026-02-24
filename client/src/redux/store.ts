// typescript applied
import { configureStore } from "@reduxjs/toolkit";

import { apiSlice } from "./slices/async/apiSlice";
import authSliceReducer from "./slices/sync/authSlice";
import accessTokenSliceReducer from "./slices/sync/accessTokenSlice";
import themeSliceReducer from "./slices/sync/themeSlice";
import sidebarOpenSliceReducer from "./slices/sync/sidebarOpenSlice";


const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        auth: authSliceReducer,
        theme: themeSliceReducer,
        accessToken: accessTokenSliceReducer,
        sidebarOpen: sidebarOpenSliceReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;