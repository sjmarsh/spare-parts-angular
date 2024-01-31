import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, of } from "rxjs";
import Part from "../types/Part";
import PartCategory from "../types/PartCategory";

@Injectable({
    providedIn: 'root'
  })
export class PartService {

    //const baseUrl = `${config.SERVER_URL}/api/part`;
    baseUrl = 'https://localhost:7104/api/part';
    token = '12345' // todo create lookup function


    //constructor(private http: HttpClient){
    //}

    get(partId: number): Observable<Part> {
        /*
        return this.http.get(`${this.baseUrl}/?id=${partId}`, {
            headers: {
                'Content-Type:': 'application/json',
                Authorization: `Bearer ${this.token}`
            }
        })*/
        console.log('service called')
        return of({ id: partId, name: `Part ${partId}`, description: `The Part ${partId}`, category: PartCategory.Mechanical, weight: partId, price: partId, startDate: '2023-01-01'} as Part)
    }
}