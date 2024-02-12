import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, of } from "rxjs";
import AuthenticationRequest from "../types/AuthenticationRequest";
import AuthenticationResponse from "../types/AuthenticationResponse";


@Injectable({
    providedIn: 'root'
  })
export class LoginService {
    //const baseUrl = `${config.SERVER_URL}/api/part`;
    baseUrl = 'https://localhost:7104/api';
    authenticateUrl = `${this.baseUrl}/authenticate`;
    refreshUrl = `${this.baseUrl}/refresh`;

    login = (request: AuthenticationRequest) : Observable<AuthenticationResponse> => {
        console.log('login service: login')
        // todo call api
        return of({
            userName: 'admin',
            displayName: "Administrator",
            isAuthenticated: true,
            message: 'logged in',
            accessToken: 'amazing token'
        } as AuthenticationResponse)
    }
}