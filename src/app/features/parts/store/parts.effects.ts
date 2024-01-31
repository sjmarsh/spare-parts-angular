import { Actions, createEffect, ofType} from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { PartService } from '../services/part-service';
import { fetchPart, fetchPartFail, fetchPartSuccess, showDetail } from './parts.actions';
import { switchMap, map, catchError } from 'rxjs';
import DetailMode from '../../../constants/detailMode';

@Injectable()
export class PartsEffects {

    constructor(private actions$: Actions, private partService: PartService){}

    loadPart$ = createEffect(() => this.actions$.pipe(
        ofType(fetchPart),
        switchMap(({partId}) => this.partService.get(partId).pipe(
            map(part => fetchPartSuccess({ part })),
            catchError(() => [fetchPartFail()])
        ))
    ))
    
    loadPartSuccess$ = createEffect(() => this.actions$.pipe(
        ofType(fetchPartSuccess),
        map(() => showDetail({ mode: DetailMode.Edit}))
    ))

}