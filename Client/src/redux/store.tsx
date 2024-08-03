// import { configureStore } from '@reduxjs/toolkit';
// import rootReducer from './rootReducer';

// const store = configureStore({
//   reducer: rootReducer,
//   // Optionally add middleware if needed
// });

// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;

// export default store;

import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "./auth/authSlice";
import createSagaMiddleware from "redux-saga";
import categoriesSlice from "./categories/categoriesSlice";
import authWatch from "./saga/Auth";
import AuthReducer from "./reducers/Auth";
import voucherReducer from './discount/voucherSlice'
// Cấu hình Redux Persist
const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, authReducer);
const sagaMiddleware = createSagaMiddleware();
export const store = configureStore({
//   reducer: {
//     auth: persistedReducer,
//     categories: categoriesSlice,
//     authReducers: authReducer,
//     AuthReducer: AuthReducer,
//   },
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       serializableCheck: false,
//     }).concat(sagaMiddleware),
// });
    reducer: {
        auth: persistedReducer,
        categories: categoriesSlice,
        AuthReducer: AuthReducer,
        authReducers: authReducer,
        voucher: voucherReducer,

           },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }).concat(sagaMiddleware),
});
sagaMiddleware.run(authWatch);
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// import { configureStore } from '@reduxjs/toolkit';
// import { persistStore, persistReducer } from 'redux-persist';
// import storage from 'redux-persist/lib/storage';

// // Cấu hình Redux Persist
// const persistConfig = {
//     key: 'root',
//     storage,
// };

// const persistedReducer = persistReducer(persistConfig, authReducer);

// export const store = configureStore({
//     reducer: {
//         auth: persistedReducer,
//     },
//     middleware: (getDefaultMiddleware) =>
//         getDefaultMiddleware({
//             serializableCheck: false,
//         }),
// });

// export const persistor = persistStore(store);

// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;
