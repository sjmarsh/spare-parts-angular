import { Actions, createEffect, ofType} from '@ngrx/effects';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { switchMap, map, tap, catchError } from 'rxjs';

import { PartService } from '../services/part-service';
import { fetchReport, fetchReportSuccess, fetchReportFail } from './partsReport.actions';


@Injectable()
export class PartsReportEffects {
    
    constructor(private router: Router, private actions$: Actions, private partService: PartService){}

    fetchReport$ = createEffect(() => this.actions$.pipe(
        ofType(fetchReport),
        switchMap(() => this.partService.fetchReport().pipe(
            map(reportData => fetchReportSuccess({reportData})),
            catchError(() => [fetchReportFail()])
        ))
    ));

    fetchReportSuccess$ = createEffect(() => this.actions$.pipe(
        ofType(fetchReportSuccess),
        tap(() => {
            this.router.navigate(['/part-report']);
        })
    ), {dispatch: false})
}