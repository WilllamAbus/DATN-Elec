// import { configureStore } from "@reduxjs/toolkit";
// import { persistStore, persistReducer } from "redux-persist";
// import storage from "redux-persist/lib/storage";
import rootReducer from "./rootReducer"; // This should include all reducers

// const store = configureStore({
//   reducer: rootReducer,
//   // Optionally add middleware if needed
// });

// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;

// export default store;




import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; 
// import authReducer from './auth/authSlice';
import voucherReducer from './discount/voucherSlice'
import categoriesSlice from './categories/categoriesSlice';
import checkoutSlice from './checkout/checkoutSlice';
// Cấu hình Redux Persist
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: {
        auth: persistedReducer,
        categories: categoriesSlice,
        voucher: voucherReducer,
        checkout: checkoutSlice

           },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
