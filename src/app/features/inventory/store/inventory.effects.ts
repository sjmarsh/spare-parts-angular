import { Actions, createEffect, ofType} from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { switchMap, map, catchError } from 'rxjs';

import { InventoryService } from '../services/inventory-service';
import {
    createInventoryItem, createInventoryItemSuccess, createInventoryItemFail, 
    createInventoryItemList, createInventoryItemListSuccess, createInventoryItemListFail,
    fetchCurrentParts, fetchCurrentPartsSuccess, fetchCurrentPartsFail,
    fetchInventory, fetchInventorySuccess, fetchInventoryFail } from './inventory.actions';
import { PartService } from '../../parts/services/part-service';


@Injectable()
export class InventoryEffects {

    constructor(private actions$: Actions, private inventoryService: InventoryService, private partService: PartService) {  
    }

    createInventoryItem$ = createEffect(() => this.actions$.pipe(
        ofType(createInventoryItem),
        switchMap(({item}) => this.inventoryService.createInventoryItem(item).pipe(
            map(response => createInventoryItemSuccess({response})),
            catchError((response) => [createInventoryItemFail({response})])
        ))
    ))

    createInventoryItemList$ = createEffect(() => this.actions$.pipe(
        ofType(createInventoryItemList),
        switchMap(({items}) => this.inventoryService.createInventoryItemList(items).pipe(
            map(response => createInventoryItemListSuccess({response})),
            catchError((response) => [createInventoryItemListFail({response})])
        ))
    ))

    fetchCurrentParts$ = createEffect(() => this.actions$.pipe(
        ofType(fetchCurrentParts),
        switchMap(() => this.partService.fetchCurrentParts().pipe(
            map(response => fetchCurrentPartsSuccess({response})),
            catchError((response) => [fetchCurrentPartsFail({response})])
        ))
    ))

    fetchInventory$ = createEffect(() => this.actions$.pipe(
        ofType(fetchInventory),
        switchMap(({options}) => this.inventoryService.fetchInventory(options).pipe(
            map(response => fetchInventorySuccess({response})),
            catchError((response) => [fetchInventoryFail({response})])
        ))
    ))
}