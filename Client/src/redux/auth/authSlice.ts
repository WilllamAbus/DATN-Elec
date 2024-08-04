import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
    login: {
        currentUser: string | null;
        isFetching: boolean;
        error: boolean;
        isAuthenticated: boolean;
        token: string | null;
        isLoggedIn: boolean;
    };
}

const initialState: AuthState = {
    login: {
        currentUser: null,
        isFetching: false,
        error: false,
        isAuthenticated: false,
        token: null,
        isLoggedIn: false,
    },
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginStart: (state) => {
            state.login.isFetching = true;
        },
        loginSuccess: (state, action: PayloadAction<{ currentUser: string, token: string }>) => {
            state.login.isFetching = false;
            state.login.currentUser = action.payload.currentUser;
            state.login.token = action.payload.token;
            state.login.isAuthenticated = true;
            state.login.isLoggedIn = true;
            state.login.error = false;
        },
        loginFailed: (state) => {
            state.login.isFetching = false;
            state.login.error = true;
            state.login.isAuthenticated = false;
            state.login.isLoggedIn = false;
        },
        logout: (state) => {
            state.login.currentUser = null;
            state.login.token = null;
            state.login.isAuthenticated = false;
            state.login.isLoggedIn = false;
        },
    },
});

export const { loginStart, loginSuccess, loginFailed, logout } = authSlice.actions;

export default authSlice.reducer;
