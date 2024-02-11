import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, of } from "rxjs";
import Part from "../types/Part";
import PartCategory from "../types/PartCategory";
import PartResponse from "../types/PartResponse";

@Injectable({
    providedIn: 'root'
  })
export class PartService {

    //const baseUrl = `${config.SERVER_URL}/api/part`;
    baseUrl = 'https://localhost:7104/api/part';
    token = '12345' // todo create lookup function


    //constructor(private http: HttpClient){
    //}

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