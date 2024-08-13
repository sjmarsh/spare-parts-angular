import { Pipe, PipeTransform } from "@angular/core";
import humanizeString from "humanize-string";

@Pipe({name: 'humanize', standalone: true})
export class HumanizePipe implements PipeTransform {
    transform(value: any, ...args: any[]) {
        if(value && typeof(value) === 'string') {
            return humanizeString(value);
        }
        return value;
    }
}