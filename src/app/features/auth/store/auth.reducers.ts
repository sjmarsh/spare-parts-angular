import { createReducer, on } from "@ngrx/store";

import FetchStatus from "../../../constants/fetchStatus";
import { getTokenDetails } from '../services/jwtHelpers';
import { login, loginSuccess, loginFail, logout,
        performTokenRefresh, performTokenRefreshSuccess, performTokenRefreshFail } from './auth.actions';

export interface AuthState {
    accessToken: string | null;
    isAuthenticated: boolean;
    roles: Array<string> | null;
    fetchStatus: FetchStatus;
    error?: string | null;
}

const initialState: AuthState = {
    accessToken: null,
    isAuthenticated: false,
    roles: null,
    fetchStatus: FetchStatus.Idle,
    error: null
}

export const authReducer = createReducer(
    initialState,
    on(login, (state) => ({...state, fetchStatus: FetchStatus.Loading})),
    on(loginSuccess, (state, {response}) => ({
        ...state, 
        fetchStatus: FetchStatus.Succeeded, 
        accessToken: response.accessToken, 
        isAuthenticated: response.isAuthenticated,
        error: response.message,
        roles: getTokenDetails(response.accessToken).Roles
    })),
    on(loginFail, (state, {response}) => ({
        ...state,
        fetchStatus: FetchStatus.Failed,
        error: response.message,
        accessToken: null,
        isAuthenticated: false,
        roles: null
    })),
    on(logout, (state) => ({
        ...state,
        fetchStatus: FetchStatus.Idle,
        error: null,
        accessToken: null,
        isAuthenticated: false,
        roles: null
    })),
    on(performTokenRefresh, (state) => ({
        ...state,
        fetchStatus: FetchStatus.Loading
    })),
    on(performTokenRefreshSuccess, (state, {response}) => ({
        ...state,
        fetchStatus: FetchStatus.Succeeded,
        isAuthenticated: response?.isAuthenticated ?? false,
        accessToken: response?.accessToken,
        roles: getTokenDetails(response.accessToken).Roles
    })),
    on(performTokenRefreshFail, (state, {response}) => ({
        ...state,
        fetchStatus: FetchStatus.Failed,
        isAuthenticated: false,
        accessToken: null,
        roles: null,
        error: response.message
    }))
)
