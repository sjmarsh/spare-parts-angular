import { createReducer, on } from "@ngrx/store";

import FetchStatus from "../../../constants/fetchStatus";
import { getTokenDetails } from '../services/jwtHelpers';
import { login, loginSuccess, loginFail, logout } from './auth.actions';

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
    }))
)
