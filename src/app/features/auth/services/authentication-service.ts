import { Injectable, Inject } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

import { APP_CONFIG, AppConfig } from "../../../app.config";
import AuthenticationRequest from "../types/AuthenticationRequest";
import AuthenticationResponse from "../types/AuthenticationResponse";

@Injectable({
    providedIn: 'root'
  })
export class AuthenticationService {
    private baseUrl: string;
    private authenticateUrl: string;
    private refreshUrl: string;

    constructor(@Inject(APP_CONFIG) private appConfig: AppConfig, private httpClient: HttpClient) {
        this.baseUrl = `${this.appConfig.serverUrl}/api/user`;
        this.authenticateUrl = `${this.baseUrl}/authenticate`;
        this.refreshUrl = `${this.baseUrl}/refresh`;
    }

    login = (request: AuthenticationRequest) : Observable<AuthenticationResponse> => {
        console.log('login service: login')
        const httpHeaders = new HttpHeaders({
            'Content-Type': 'application/json'
        })
        return this.httpClient.post<AuthenticationResponse>(this.authenticateUrl, request, {headers: httpHeaders});
    }
}