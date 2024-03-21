import { Actions, createEffect, ofType} from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { switchMap, map, tap, catchError } from 'rxjs';

import { AuthenticationService } from '../services/authentication-service';
import { login, loginSuccess, loginFail, logout } from './auth.actions';

@Injectable()
export class AuthEffects {
    constructor(private actions$: Actions, private router: Router, private loginService: AuthenticationService) {
    }

    login$ = createEffect(() => this.actions$.pipe(
        ofType(login),
        switchMap(({request}) => this.loginService.login(request).pipe(
            map(response => loginSuccess({response})),
            catchError(response => [loginFail(response)])
        ))
    ))

    logout$ = createEffect(() => this.actions$.pipe(
        ofType(logout),
        tap(() => {
            this.router.navigate(['/home']); 
        })
    ), {dispatch: false})
/*
    performTokenRefresh$ = createEffect(() => this.actions$.pipe(
        ofType(performTokenRefresh),
        switchMap(({token}) => this.loginService.performTokenRefresh(token).pipe(
            map(response => performTokenRefreshSuccess({response})),
            catchError(response => [performTokenRefreshFail(response)])
        ))
    ))*/
}