import { Actions, createEffect, ofType} from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { switchMap, map, tap, catchError } from 'rxjs';

import { PartService } from '../services/part-service';
import { 
    createPart, createPartFail, createPartSuccess,
    updatePart, updatePartSuccess, updatePartFail, 
    deletePart, deletePartSuccess, deletePartFail,
    fetchPart, fetchPartSuccess, fetchPartFail, 
    showDetail  } from './parts.actions';
import { fetchParts } from './partsList.actions';
import DetailMode from '../../../constants/detailMode';


@Injectable()
export class PartsEffects {

    constructor(private actions$: Actions, private partService: PartService){}

    loadPart$ = createEffect(() => this.actions$.pipe(
        ofType(fetchPart),
        switchMap(({partId}) => this.partService.fetchPart(partId).pipe(
            map(partResponse => fetchPartSuccess({ partResponse })),
            catchError((partResponse) => [fetchPartFail(partResponse)])
        ))
    ))
    
    loadPartSuccess$ = createEffect(() => this.actions$.pipe(
        ofType(fetchPartSuccess),
        map(() => showDetail({ mode: DetailMode.Edit}))
    ))

    createPart$ = createEffect(() => this.actions$.pipe(
        ofType(createPart),
        switchMap(({part}) => this.partService.createPart(part).pipe(
            map(partResponse => createPartSuccess({partResponse})),
            catchError((partResponse) => [createPartFail(partResponse)])
        ))
    ))

    updatePart$ = createEffect(() => this.actions$.pipe(
        ofType(updatePart),
        switchMap(({part}) => this.partService.updatePart(part).pipe(
            map(partResponse => updatePartSuccess({partResponse})),
            catchError((partResponse) => [updatePartFail(partResponse)])
        ))
    ))

    updatePartSuccess$ = createEffect(() => this.actions$.pipe(
        ofType(updatePartSuccess),
        map(() => fetchParts())
    ))

    deletePart$ = createEffect(() => this.actions$.pipe(
        ofType(deletePart),
        switchMap(({partId}) => this.partService.deletePart(partId).pipe(
            map(partResponse => deletePartSuccess({partResponse})),
            catchError((partResponse) => [deletePartFail(partResponse)])
        ))
    ))

}