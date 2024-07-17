import { Actions, createEffect, ofType} from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { switchMap, map, catchError } from 'rxjs';

import { partSearch, partSearchSuccess, partSearchFail } from './partSearch.actions';
import { PartSearchService } from '../services/part-search-service';


@Injectable()
export class PartSearchEffects {

    constructor(private actions$: Actions, private partSearchService: PartSearchService) {}

    partSearch$ = createEffect(() => this.actions$.pipe(
        ofType(partSearch),
        switchMap(({graphQLRequest}) => this.partSearchService.partSearch(graphQLRequest).pipe(
            map(response => partSearchSuccess({ response })),
            catchError((response) => [partSearchFail()]) 
        ))
    ))
}