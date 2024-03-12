import { Actions, createEffect, ofType} from '@ngrx/effects';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { switchMap, map, tap, catchError } from 'rxjs';

import { InventoryService } from '../services/inventory-service';
import { fetchReport, fetchReportSuccess, fetchReportFail } from './inventoryReport.actions';

@Injectable()
export class InventoryReportEffects {

    constructor(private actions$: Actions, private router: Router, private inventoryService: InventoryService) {
    }

    
    fetchReport$ = createEffect(() => this.actions$.pipe(
        ofType(fetchReport),
        switchMap(({isCurrent}) => this.inventoryService.fetchReport(isCurrent).pipe(
            map(reportData => fetchReportSuccess({reportData})),
            catchError(() => [fetchReportFail()])
        ))
    ))

    fetchReportSuccess$ = createEffect(() => this.actions$.pipe(
        ofType(fetchReportSuccess),
        tap(() => {
            this.router.navigate(['/inventory-report']);
        })
    ), {dispatch: false})
}