import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
    login: {
        currentUser: string | null;
        isFetching: boolean;
        error: boolean;
        isAuthenticated: boolean;
    };
}

const initialState: AuthState = {
    login: {
        currentUser: null,
        isFetching: false,
        error: false,
        isAuthenticated: false,
    },
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginStart: (state) => {
            state.login.isFetching = true;
        },
        loginSuccess: (state, action: PayloadAction<string>) => {
            state.login.isFetching = false;
            state.login.currentUser = action.payload;
            state.login.isAuthenticated = true;
            state.login.error = false;
        },
        loginFailed: (state) => {
            state.login.isFetching = false;
            state.login.error = true;
            state.login.isAuthenticated = false;
        },
        logout: (state) => {
            state.login.currentUser = null;
            state.login.isAuthenticated = false;
        },
    },
});

export const { loginStart, loginSuccess, loginFailed, logout } = authSlice.actions;

export default authSlice.reducer;
