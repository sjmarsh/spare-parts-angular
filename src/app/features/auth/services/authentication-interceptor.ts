import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { AuthState } from '../store/auth.reducers';
import { getTokenDetails } from './jwtHelpers';
import { loginFail, setToken } from '../store/auth.actions';
import { AuthenticationService } from './authentication-service';

@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {
    
    hasExpired: boolean = false;
    token: string = '';

    constructor(private store: Store<{login: AuthState}>, private authenticationService: AuthenticationService) {
        // this.store.select(state => state.login).subscribe(s => {
        //     this.token = s.accessToken ?? '';
        //     this.hasExpired = getTokenDetails(this.token).HasExpired;       
        // })        
    }
    
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        console.log('interceptor')
    
        if (req.url.includes("user/authenticate") || req.url.includes('user/refresh')) {
            console.log("POST INTERCEPT authenticate/refresh: ", req.url);
            return next.handle(req);
        }

        this.store.select(state => state.login).subscribe(s => {
            console.log('sub')
            this.token = s.accessToken ?? '';
            this.hasExpired = getTokenDetails(this.token).HasExpired;       
            if(this.hasExpired) {
                console.log('Token has expired');
                //this.store.dispatch(performTokenRefresh({token: this.token}));
                this.authenticationService.performTokenRefresh(this.token).subscribe(res => {
                    if(res.isAuthenticated && res.accessToken) {
                        this.store.dispatch(setToken({token: res.accessToken}));
                    } 
                    else {
                        this.store.dispatch(loginFail({response: res}));
                    }
                })
                debugger;
            }
        })
        
        let newRequest = req.clone({
            setHeaders: { Authorization: `Bearer ${this.token}`}
        })
        console.log(`Request intercepted. Token value: ${this.token}`)
        return next.handle(newRequest);
    }
}