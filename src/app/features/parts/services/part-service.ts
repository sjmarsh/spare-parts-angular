import { Injectable, Inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { Store } from '@ngrx/store';

import { APP_CONFIG, AppConfig } from "../../../app.config";
import { AuthState } from '../../auth/store/auth.reducers';
import { PartListState } from "../store/partsList.reducers";
import Part from "../types/Part";
import PartResponse from "../types/PartResponse";
import PartListReponse from "../types/PartListResponse";
import TableSettings from "../../../constants/tableSettings";

@Injectable({
    providedIn: 'root'
  })
export class PartService {
    private baseUrl = ''
    private currentPage: number = 0;

    constructor(@Inject(APP_CONFIG) private appConfig: AppConfig, private httpClient: HttpClient, private store: Store<{login: AuthState}>, private partListStore: Store<{partList: PartListState}>) {
        this.baseUrl = `${this.appConfig.serverUrl}/api/part`;
        this.partListStore.select(state => state.partList).subscribe(s => {
            this.currentPage = s.currentPage;
        })
    }

    fetchParts = (page?: number | null): Observable<PartListReponse> => {
        const fetchUrl = `${this.baseUrl}/index`;
        page = page ?? this.currentPage;
        let skip = (page == 0) ? 0 : page * TableSettings.PageSize;
        const paging = `?isCurrentOnly=False&skip=${skip}&take=${TableSettings.PageSize}`;
        return this.httpClient.get<PartListReponse>(`${fetchUrl}${paging}`);
    }

    fetchPart(partId: number): Observable<PartResponse> {
        const fetchUrl = `${this.baseUrl}/?id=${partId}`;
        return this.httpClient.get<PartResponse>(fetchUrl);
    }

    createPart(part: Part): Observable<PartResponse> {
        if(!part || part == undefined) {
            console.log('part undefined')
            return of({ hasError: true, message: 'Cannot create null part.'} as PartResponse);
        }
        return this.httpClient.post<PartResponse>(this.baseUrl, part);
    }

    updatePart(part: Part): Observable<PartResponse> {
        if(!part || part == undefined) {
            console.log('part undefined')
            return of({ hasError: true, message: 'Cannot update null part.'} as PartResponse);
        }
        return this.httpClient.put<PartResponse>(this.baseUrl, part);
    }

    deletePart(partId: number): Observable<PartResponse> {
        if(partId === 0){
            return of({ hasError: true, message: 'PartId must be provided for the part to delete.'} as PartResponse);
        }
        const deleteUrl = `${this.baseUrl}/?id=${partId}`;
        return this.httpClient.delete<PartResponse>(deleteUrl);
    }

    fetchReport(): Observable<ArrayBuffer> {
        const reportUrl = `${this.baseUrl}/report`;
        return this.httpClient.get(reportUrl, {responseType: "arraybuffer"});
    }

    fetchCurrentParts = () : Observable<PartListReponse> => {
        const fetchUrl = `${this.baseUrl}/index?isCurrentOnly=true`
        return this.httpClient.get<PartListReponse>(fetchUrl, {withCredentials: true});
    }

}