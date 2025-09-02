import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { authReducer } from "./slices/authSlice";
import { checkoutReducer } from "./slices/checkoutSlice";
import { merchantReducer } from "./slices/merchantSlice";

const rootReducer = combineReducers({
  authReducer,
  checkoutReducer,
  merchantReducer,
});

const persistConfig = {
  key: "root",
  storage,
  blacklist: [""],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
