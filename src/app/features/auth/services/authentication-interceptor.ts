import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { AuthState } from '../store/auth.reducers';
import { getTokenDetails } from './jwtHelpers';
import { performTokenRefresh } from '../store/auth.actions';

@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {
    
    hasExpired: boolean = false;
    token: string = '';

    constructor(private store: Store<{login: AuthState}>) {
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
                this.store.dispatch(performTokenRefresh());
            }
        })
        
        let newRequest = req.clone({
            setHeaders: { Authorization: `Bearer ${this.token}`}
        })
        console.log(`Request intercepted. Token value: ${this.token}`)
        return next.handle(newRequest);
    }
}