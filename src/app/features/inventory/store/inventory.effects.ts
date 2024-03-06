import { Actions, createEffect, ofType} from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { switchMap, map, catchError } from 'rxjs';

import { InventoryService } from '../services/inventory-service';
import {
    createInventoryItem, createInventoryItemSuccess, createInventoryItemFail, 
    fetchCurrentParts, fetchCurrentPartsSuccess, fetchCurrentPartsFail } from './inventory.actions';
import { PartService } from '../../parts/services/part-service';


@Injectable()
export class InventoryEffects {

    constructor(private actions$: Actions, private inventoryService: InventoryService, private partService: PartService) {  
    }
/**ofType(createInventoryItem),
        switchMap({item}) => this.inventoryService.createInventoryItem(item).pipe(
            map(response => createInventoryItemSuccess({response})),
            catchError((response) => [createInventoryItemFail(response)])
        ) */


    createInventoryItem$ = createEffect(() => this.actions$.pipe(
        ofType(createInventoryItem),
        switchMap(({item}) => this.inventoryService.createInventoryItem(item).pipe(
            map(response => createInventoryItemSuccess({response})),
            catchError((response) => [createInventoryItemFail({response})])
        ))
    ))

    fetchCurrentParts$ = createEffect(() => this.actions$.pipe(
        ofType(fetchCurrentParts),
        switchMap(() => this.partService.fetchCurrentParts().pipe(
            map(response => fetchCurrentPartsSuccess({response})),
            catchError((response) => [fetchCurrentPartsFail({response})])
        ))
    ))
}