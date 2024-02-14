import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import AuthenticationRequest from "../types/AuthenticationRequest";
import AuthenticationResponse from "../types/AuthenticationResponse";

@Injectable({
    providedIn: 'root'
  })
export class AuthenticationService {
    //const baseUrl = `${config.SERVER_URL}/api/part`;
    private readonly baseUrl: string = 'https://localhost:7104/api/user';
    private readonly authenticateUrl: string = `${this.baseUrl}/authenticate`;
    private readonly refreshUrl: string = `${this.baseUrl}/refresh`;

    constructor(private httpClient: HttpClient) {
    }

    login = (request: AuthenticationRequest) : Observable<AuthenticationResponse> => {
        console.log('login service: login')
        const httpHeaders = new HttpHeaders({
            'Content-Type': 'application/json'
        })
        return this.httpClient.post<AuthenticationResponse>(this.authenticateUrl, request, {headers: httpHeaders});
    }
}