import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { Store } from '@ngrx/store';
import { AuthState } from '../../auth/store/auth.reducers';

import Part from "../types/Part";
import PartResponse from "../types/PartResponse";
import PartListReponse from "../types/PartListResponse";

@Injectable({
    providedIn: 'root'
  })
export class PartService {

    //const baseUrl = `${config.SERVER_URL}/api/part`;
    private readonly baseUrl = 'https://localhost:7104/api/part';
    private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});

    constructor(private httpClient: HttpClient, private store: Store<{login: AuthState}>) {
        this.store.select(state => state.login).subscribe(s => {
            const token = s.accessToken ?? '';
            this.httpHeaders = this.httpHeaders.set('Authorization', `Bearer ${token}`);
        })
    }

    fetchParts = (): Observable<PartListReponse> => {
        const fetchUrl = `${this.baseUrl}/index`;
        const paging = '?isCurrentOnly=False&skip=0&take=10'; // todo implement paging
        return this.httpClient.get<PartListReponse>(`${fetchUrl}${paging}`, {headers: this.httpHeaders});
    }

    fetchPart(partId: number): Observable<PartResponse> {
        const fetchUrl = `${this.baseUrl}/?id=${partId}`;
        return this.httpClient.get<PartResponse>(fetchUrl, {headers: this.httpHeaders});     
    }

    createPart(part: Part): Observable<PartResponse> {
        
        if(!part || part == undefined) {
            console.log('part undefined')
            return of({ hasError: true, message: 'Cannot create null part.'} as PartResponse);
        }
        part.id = 1;
        console.log('part created');
        return of({ value: part, hasError: false} as PartResponse);
    }

    updatePart(part: Part): Observable<PartResponse> {
        if(!part || part == undefined) {
            console.log('part undefined')
            return of({ hasError: true, message: 'Cannot update null part.'} as PartResponse);
        }
        return this.httpClient.put<PartResponse>(this.baseUrl, part, {headers: this.httpHeaders});
    }

    deletePart(partId: number): Observable<PartResponse> {
        console.log(`delete part ${partId}`)
        if(partId === 0){
            return of({} as PartResponse);
        }

        // TODO : delete
        return of({ message: 'deleted'} as PartResponse);
    }

}