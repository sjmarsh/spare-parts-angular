import { Actions, createEffect, ofType} from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { switchMap, map, catchError } from 'rxjs';

import { PartService } from '../services/part-service';
import { fetchParts, fetchPartsSuccess, fetchPartsFail } from '../store/partsList.actions';

@Injectable()
export class PartsListEffects {

    constructor(private actions$: Actions, private partService: PartService){}
    
    fetchParts$ = createEffect(() => this.actions$.pipe(
        ofType(fetchParts),
        switchMap(() => this.partService.fetchParts().pipe(
            map(partListResponse => fetchPartsSuccess({ partListResponse})),
            catchError((partListResponse) => [fetchPartsFail({ partListResponse })])
        ))
    ))
}