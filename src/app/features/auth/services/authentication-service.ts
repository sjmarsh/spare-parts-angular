import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, map, of } from "rxjs";
import AuthenticationRequest from "../types/AuthenticationRequest";
import AuthenticationResponse from "../types/AuthenticationResponse";
import { response } from "express";


@Injectable({
    providedIn: 'root'
  })
export class AuthenticationService {
    //const baseUrl = `${config.SERVER_URL}/api/part`;
    private baseUrl: string = 'https://localhost:7104/api';
    private authenticateUrl: string = `${this.baseUrl}/authenticate`;
    private refreshUrl: string = `${this.baseUrl}/refresh`;

    constructor(private httpClient: HttpClient){
    }

    login = (request: AuthenticationRequest) : Observable<AuthenticationResponse> => {
        console.log('login service: login')
        this.httpClient.post(this.authenticateUrl, request).pipe(
            map(response => {
                console.log(response)
                return true;
            })
        )
        // todo call api
        
        return of({
            userName: request.userName,
            displayName: "Administrator",
            isAuthenticated: true,
            message: 'logged in',
            accessToken: 'amazing token'
        } as AuthenticationResponse)
        
    }
}