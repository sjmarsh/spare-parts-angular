import { Actions, createEffect, ofType} from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { switchMap, map, catchError } from 'rxjs';

import { AuthenticationService } from '../services/authentication-service';
import { login, loginSuccess, loginFail, logout } from './auth.actions';

@Injectable()
export class AuthEffects {
    constructor(private actions$: Actions, private loginService: AuthenticationService) {
    }

    login$ = createEffect(() => this.actions$.pipe(
        ofType(login),
        switchMap(({request}) => this.loginService.login(request).pipe(
            map(response => loginSuccess({response})),
            catchError(response => [loginFail(response)])
        ))
    ))
}