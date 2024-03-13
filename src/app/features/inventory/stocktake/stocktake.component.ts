import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, ReactiveFormsModule, FormArray, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { Store } from '@ngrx/store';

import StocktakeItem from '../types/StocktakeItem';
import InventoryItem from '../types/InventoryItem';
import FetchStatus from '../../../constants/fetchStatus';
import { InventoryState, selectInventoryStatus, selectStocktakeItems } from '../store/inventory.reducers';
import { createInventoryItemList, fetchInventory } from '../store/inventory.actions';
import { getLocalDateTimeString } from '../../../infrastructure/dateTime';

@Component({
    selector: 'app-stocktake',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, MatInputModule, MatTableModule, MatButtonModule],
    styleUrl: './stocktake.component.css',
    template: `
        <div>
            <ng-container *ngIf="stocktakeForm">
                <form  [formGroup]="stocktakeForm" (ngSubmit)="onSubmit()">
                    <table mat-table [dataSource]="getItemFormArray().controls">
                        <ng-container matColumnDef="partName">
                        <th mat-header-cell *matHeaderCellDef>Part Name</th>
                        <td mat-cell *matCellDef="let element">
                            <input [formControl]="element.get('partName')">
                        </td>
                        </ng-container>
                        <ng-container matColumnDef="quantity">
                        <th mat-header-cell *matHeaderCellDef>Quantity</th>
                        <td mat-cell *matCellDef="let element">
                            <input [formControl]="element.get('quantity')">
                        </td>
                        </ng-container>
                        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
                    </table>
                    <button mat-flat-button color="primary" type="submit">Submit</button>
                    <mat-error>{{errorMessage}}</mat-error>
                </form>
            </ng-container>
        </div>
    `
})

export class StocktakeComponent {
    stocktakeForm?: FormGroup
    displayedColumns: string[] = ['partName', 'quantity']
    errorMessage: string = ''

    constructor(private store: Store<{inventory: InventoryState}>) {
    }

    ngOnInit(): void {
        this.store.dispatch(fetchInventory({options: { page: 0, isCurrent: true, takeAll: true}}));
        
        this.store.select(s => selectStocktakeItems(s.inventory)).subscribe(s => {
            this.stocktakeForm = this.initForm(s);
        })
        this.store.select(s => selectInventoryStatus(s.inventory)).subscribe(status => {
            this.errorMessage = status === FetchStatus.Failed ? "An error occurred fetching stocktake items" : "";
        })
    }

    private initForm = (items: Array<StocktakeItem>): FormGroup => {    
        const itemArray = new FormArray<FormGroup>([]);
        if(items && items.length > 0) {
            items.forEach(item => {
                itemArray.push(new FormGroup({
                    partId: new FormControl(item.partID),
                    partName: new FormControl(item.partName),
                    quantity: new FormControl(item.quantity)
                }))
            })
        }
        const frm = new FormGroup({
            items: itemArray
        })
        return frm;
    }

    getItemFormArray = (): FormArray<FormGroup> => {
        const defaultValue = new FormArray<FormGroup>([])
        if(!this.stocktakeForm) {
            return defaultValue;
        }
        const items = this.stocktakeForm.get('items') as FormArray;
        if(!items) {
            return defaultValue;
        }
        return items;
    }

    onSubmit = (): void => {
        if(!this.stocktakeForm) {
            throw('Unable to submit null form');
        }
        this.errorMessage = "";
        const itemFormArray = this.getItemFormArray();
        if(itemFormArray) {
            const formItems = itemFormArray.value as Array<StocktakeItem>;
            if(formItems) {
                let datedItems = formItems.map(i => ({...i, id: 0, dateRecorded: getLocalDateTimeString()} as InventoryItem));
                this.store.dispatch(createInventoryItemList({items: datedItems}))    
            }                        
        }
    }
}