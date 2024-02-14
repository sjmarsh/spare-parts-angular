import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { Store } from '@ngrx/store';
import { AuthState } from '../../auth/store/auth.reducers';

import Part from "../types/Part";
import PartCategory from "../types/PartCategory";
import PartResponse from "../types/PartResponse";
import PartListReponse from "../types/PartListResponse";



@Injectable({
    providedIn: 'root'
  })
export class PartService {

    //const baseUrl = `${config.SERVER_URL}/api/part`;
    private readonly baseUrl = 'https://localhost:7104/api/part';
    private token = '' 

    constructor(private httpClient: HttpClient, private store: Store<{login: AuthState}>) {
        this.store.select(state => state.login).subscribe(s => {
            this.token = s.accessToken ?? '';
        })
    }

    fetchParts = (): Observable<PartListReponse> => {
        const fetchUrl = `${this.baseUrl}/index`;
        const paging = '?isCurrentOnly=False&skip=0&take=10'; // todo implement paging
        const tokenHeader = `Bearer ${this.token}`;

        const httpHeaders = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': tokenHeader
        });
        
        return this.httpClient.get<PartListReponse>(`${fetchUrl}${paging}`, {headers: httpHeaders});
    }


    fetchPart(partId: number): Observable<Part> {
        /*
        return this.http.get(`${this.baseUrl}/?id=${partId}`, {
            headers: {
                'Content-Type:': 'application/json',
                Authorization: `Bearer ${this.token}`
            }
        })*/
        console.log('service called')
        return of({ 
            id: partId, 
            name: `Part ${partId}`, 
            description: `The Part ${partId}`, 
            category: PartCategory.Mechanical, 
            weight: partId, 
            price: partId, 
            startDate: '2023-01-01',
            attributes: [{
                name: 'shape',
                description: 'the shape of the part',
                value: 'round'
            }]
        } as Part)
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
        console.log(part)
        if(!part || part == undefined) {
            console.log('part undefined')
            return of({ hasError: true, message: 'Cannot update null part.'} as PartResponse);
        }
        console.log('part updated');
        return of({ value: part, hasError: false} as PartResponse);
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