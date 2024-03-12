import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTable } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Store } from '@ngrx/store';

import InventoryItem from '../types/InventoryItem';
import { InventoryState } from '../store/inventory.reducers';
import { fetchInventory } from '../store/inventory.actions';
import TableSettings from '../../../constants/tableSettings';

@Component({
    selector: 'app-inventory-table',
    standalone: true,
    imports: [CommonModule, MatTableModule, MatPaginatorModule, MatProgressBarModule],
    styleUrl: './inventory-table.component.css',
    template: `
        <div>
            <ng-container *ngIf="isLoading">
                <mat-progress-bar mode="indeterminate"></mat-progress-bar>
            </ng-container>
            <table mat-table [dataSource]="pageOfInventory">
                <ng-container matColumnDef="partName">
                  <th mat-header-cell *matHeaderCellDef>Part Name</th>
                  <td mat-cell *matCellDef="let element">{{element.partName}}</td>
                </ng-container>
                <ng-container matColumnDef="quantity">
                  <th mat-header-cell *matHeaderCellDef>Quantity</th>
                  <td mat-cell *matCellDef="let element">{{element.quantity}}</td>
                </ng-container>
                <ng-container matColumnDef="dateRecorded">
                  <th mat-header-cell *matHeaderCellDef>Date Recorded</th>
                  <td mat-cell *matCellDef="let element">{{element.dateRecorded | date:'dd/MM/yyyy'}}</td>
                </ng-container>
                <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>
            <mat-paginator
                (page)="handlePageEvent($event)"
                [length]="totalItemCount"
                [pageSize]="pageSize"
                [pageIndex]="currentPage"
                [showFirstLastButtons]="true"
                aria-label="Select parts list page"
            >
            </mat-paginator>
            <p class="custom-error">{{errorMessage}}<p>
        </div>
    `
})

export class InventoryTableComponent {
    isLoading: boolean = false;
    isFirstInit: boolean = true;
    pageOfInventory: Array<InventoryItem> = []
    totalItemCount: number = 0
    pageSize: number = TableSettings.PageSize 
    currentPage: number = 0
    currentStockPage: number = 0
    historyStockPage: number = 0
    errorMessage: string = ''
    displayedColumns: string[] = ['partName', 'quantity', 'dateRecorded']

    constructor(private store: Store<{inventory: InventoryState}>) {
    }

    @Input() isCurrent: boolean = false

    ngOnInit(): void {
        this.store.select(state => state.inventory).subscribe(s => {
            this.pageOfInventory = s.items;
            this.totalItemCount = s.totalItemCount;
            this.currentStockPage = s.currentStockPage;
            this.historyStockPage = s.historyStockPage;
            this.errorMessage = s.error ?? '';
            this.isLoading = false;    
        })
        
        if(this.isFirstInit) {
            this.fetchInventoryData();
            this.isFirstInit = false;
        }
    } 

    handlePageEvent = (e: PageEvent) => {
        if(this.isCurrent) {
            this.currentStockPage = e.pageIndex;
        }
        else {
            this.historyStockPage = e.pageIndex;
        }
        this.fetchInventoryData();
    }

    fetchInventoryData = () => {
        this.isLoading = true;
        if(this.isCurrent) {
            this.store.dispatch(fetchInventory({options: { isCurrent: true, page: this.currentStockPage, takeAll: false}}));
            this.currentPage = this.currentStockPage;
        }
        else {
            this.store.dispatch(fetchInventory({options: { isCurrent: false, page: this.historyStockPage, takeAll: false}}));
            this.currentPage = this.historyStockPage;
        }
    }
}