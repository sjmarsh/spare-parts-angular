import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class DateTimeHelper {
    
    getLocalDateTimeString = () =>
    {
        let offset = (new Date()).getTimezoneOffset() * 60000; 
        return (new Date(Date.now() - offset)).toISOString().slice(0,-1);
    }

}
