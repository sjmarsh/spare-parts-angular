import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, of } from "rxjs";
import Part from "../types/Part";

export class PartService {

    //const baseUrl = `${config.SERVER_URL}/api/part`;
    baseUrl = 'https://localhost:7104/api/part';
    token = '12345' // todo create lookup function

    constructor(private http: HttpClient){
    }

    get(partId: number): Observable<Part> {
        /*
        return this.http.get(`${this.baseUrl}/?id=${partId}`, {
            headers: {
                'Content-Type:': 'application/json',
                Authorization: `Bearer ${this.token}`
            }
        })*/
        return of({ id: partId, name: `Part ${partId}`, description: `The Part ${partId}`} as Part)
    }
}