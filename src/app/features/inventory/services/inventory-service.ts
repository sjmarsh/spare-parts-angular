import { Injectable, Inject } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { Store } from '@ngrx/store';

import { APP_CONFIG, AppConfig } from "../../../app.config";
import { AuthState } from "../../auth/store/auth.reducers";
import InventoryItem from "../types/InventoryItem";
import InventoryItemResponse from "../types/InventoryItemResponse";
import InventoryItemListResponse from "../types/InventoryItemListResponse";
import { InventoryFetchOptions } from "../store/inventory.reducers";
import TableSettings from "../../../constants/tableSettings";

@Injectable({
    providedIn: 'root'
  })
export class InventoryService {
    private baseUrl = ''
    private partUrl = ''
    private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});
    
    constructor(@Inject(APP_CONFIG) private appConfig: AppConfig, private httpClient: HttpClient, private store: Store<{login: AuthState}>) {
        this.baseUrl = `${this.appConfig.serverUrl}/api/inventory`;
        this.partUrl = `${this.appConfig.serverUrl}/api/part`;
        this.store.select(state => state.login).subscribe(s => {
            const token = s.accessToken ?? '';
            this.httpHeaders = this.httpHeaders.set('Authorization', `Bearer ${token}`);
        })
    }

    createInventoryItem = (item: InventoryItem) : Observable<InventoryItemResponse> => {
        if(!item || item == undefined) {
            console.log('item undefined');
            return of({ hasError: true, message: 'Cannot create null Inventory Item.' } as InventoryItemResponse);
        }
        return this.httpClient.post<InventoryItemResponse>(this.baseUrl, item, {headers: this.httpHeaders});
    }

    fetchInventory = (options: InventoryFetchOptions) : Observable<InventoryItemListResponse> => {
        let current = options.isCurrent ? "isCurrentOnly=true&" : "";
        let skip = (options.page == 0) ? 0 : options.page * TableSettings.PageSize;  
        let skipQuery = options.takeAll ? "" : `skip=${skip}&take=${TableSettings.PageSize}`;
        return this.httpClient.get<InventoryItemListResponse>(`${this.baseUrl}/index-detail?${current}${skipQuery}`,  {headers: this.httpHeaders});
    }

    fetchReport = (isCurrent: boolean) : Observable<ArrayBuffer> => {
        const reportUrl = `${this.baseUrl}/report?isCurrentOnly=${isCurrent}`;
        return this.httpClient.get(reportUrl, {headers: this.httpHeaders, responseType: "arraybuffer"});
    }
}