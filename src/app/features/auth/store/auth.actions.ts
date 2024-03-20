import { createAction , props} from '@ngrx/store'

import AuthenticationRequest from '../types/AuthenticationRequest'
import AuthenticationResponse from '../types/AuthenticationResponse'

export const login = createAction('[LOGIN] Login', props<{request: AuthenticationRequest}>())
export const loginSuccess = createAction('[LOGIN] Login Success', props<{response: AuthenticationResponse}>())
export const loginFail = createAction('[LOGIN] Login Fail', props<{response: AuthenticationResponse}>())

export const logout = createAction('[LOGIN] Logout')

export const performTokenRefresh = createAction('[LOGIN] Perform Token Refresh')
export const performTokenRefreshSuccess = createAction('[LOGIN] Perform Token Refresh', props<{response: AuthenticationResponse}>())
export const performTokenRefreshFail = createAction('[LOGIN] Perform Token Refresh', props<{response: AuthenticationResponse}>())
