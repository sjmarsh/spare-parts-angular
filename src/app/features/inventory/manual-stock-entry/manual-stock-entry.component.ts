import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';

import { InventoryState } from '../store/inventory.reducers';
import Part from '../../parts/types/Part';
import FetchStatus from '../../../constants/fetchStatus';
import InventoryItem from '../types/InventoryItem';
import { getLocalDateTimeString } from '../../../infrastructure/dateTime';
import { createInventoryItem, fetchCurrentParts } from '../store/inventory.actions';

@Component({
    selector: 'app-manual-stock-entry',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatProgressBarModule, MatCardModule],
    styleUrl: './manual-stock-entry.component.css',
    template: `
        <div class="manual-stock-entry">
            <ng-container *ngIf="isLoading">
                <mat-progress-bar mode="indeterminate"></mat-progress-bar>
            </ng-container>
            
            <form *ngIf="stockEntryForm" [formGroup]="stockEntryForm" (ngSubmit)="onSubmit()">
                <mat-card class="stock-entry-card">
                    <mat-form-field class="stock-entry-field">
                        <mat-label>Select Part</mat-label>
                        <mat-select name="partID" formControlName="partID">
                            <mat-option *ngFor="let part of currentParts" [value]="part.id">{{part.name}}</mat-option>
                        </mat-select>
                    </mat-form-field>
                    <mat-form-field class="stock-entry-field">
                        <mat-label>Quantity</mat-label>
                        <input matInput type="number" formControlName="quantity">
                    </mat-form-field>
                </mat-card>
                
                <button mat-flat-button color="primary" type="submit">Submit</button>

                <ng-container *ngIf="hasSubmitted">
                    <p class="custom-success">{{statusMessage}}</p>
                    <mat-error>{{errorMessage}}</mat-error>
                </ng-container>
            </form>
        </div>
    `
})

export class ManualStockEntryComponent {
    stockEntryForm?: FormGroup | null = null
    currentParts?: Array<Part> | null = null
    item: InventoryItem = {
        id: 0,
        partID: 0,
        partName: '',
        quantity: 0,
        dateRecorded: getLocalDateTimeString()
    } 
    isLoading: Boolean = false
    hasSubmitted: Boolean = false
    statusMessage?: String
    errorMessage?: String

    constructor(private store: Store<{inventory: InventoryState}>){
    }

    ngOnInit(): void {
        if(!this.currentParts || this.currentParts.length === 0) {
            this.isLoading = true;
            this.store.dispatch(fetchCurrentParts());
        }
        this.store.select(s => s.inventory)
            .subscribe(s => {                   
                this.stockEntryForm = this.initForm(this.item)
                if(s.status == FetchStatus.Succeeded) {
                    this.currentParts = s.currentParts;
                    this.statusMessage = "Success";
                    this.errorMessage = "";
                    this.isLoading = false;
                }
                if(s.status === FetchStatus.Failed) {
                    this.errorMessage = "An error occurred submitting inventory item.";
                    this.statusMessage = "";
                    this.isLoading = false;
                }
            })
    }

    initForm = (item: InventoryItem): FormGroup => {
        return new FormGroup({
            id: new FormControl(item.id),
            partID: new FormControl(item.partID),
            partName: new FormControl(item.partName),
            quantity: new FormControl(item.quantity),
            dateRecorded: new FormControl(item.dateRecorded)
        })
    }

    onSubmit = () => {
        if(!this.stockEntryForm) {
            throw('unable to submit null form');
        }
        this.isLoading = true;
        this.store.dispatch(createInventoryItem({ item: this.stockEntryForm.value }))
        this.hasSubmitted = true;
    }
}