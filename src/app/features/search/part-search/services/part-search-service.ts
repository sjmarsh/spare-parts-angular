import { Injectable, Inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { Store } from '@ngrx/store';

import { APP_CONFIG, AppConfig } from "../../../../app.config";
import { AuthState } from '../../../auth/store/auth.reducers';
import GraphQLRequest from "../../../../components/filter/types/graphQLRequest";
import { PartGraphQLResponsePaged } from "../types/partGraphQLResponsePaged";

@Injectable({
    providedIn: 'root'
  })
export class PartSearchService {
    private baseUrl = ''

    constructor(@Inject(APP_CONFIG) private appConfig: AppConfig, private httpClient: HttpClient, private store: Store<{login: AuthState}>) {
        this.baseUrl = `${this.appConfig.serverUrl}/graphql`;
    }

    partSearch(graphQLRequest: GraphQLRequest): Observable<PartGraphQLResponsePaged> {
        return this.httpClient.post<PartGraphQLResponsePaged>(this.baseUrl, graphQLRequest)
    }
}