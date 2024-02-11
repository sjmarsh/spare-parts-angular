import { Actions, createEffect, ofType} from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { switchMap, map, catchError } from 'rxjs';

import { LoginService } from '../services/login-service';
import { login, loginSuccess, loginFail, logout } from './login.actions';

@Injectable()
export class LoginEffects {
    constructor(private actions$: Actions, private loginService: LoginService) {
    }

    login$ = createEffect(() => this.actions$.pipe(
        ofType(login),
        switchMap(({request}) => this.loginService.login(request).pipe(
            map(response => loginSuccess({response})),
            catchError(response => [loginFail(response)])
        ))
    ))
}