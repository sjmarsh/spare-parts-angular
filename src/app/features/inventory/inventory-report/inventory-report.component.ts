import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';

import FetchStatus from '../../../constants/fetchStatus';
import { InventoryReportState } from '../store/inventoryReport.reducers';
import { SafePipe } from '../../../infrastructure/safe-pipe';

@Component({
    selector: 'app-inventory-report',
    standalone: true,
    imports: [CommonModule, MatProgressBarModule, MatTooltipModule, MatButtonModule, MatIconModule, SafePipe],
    styleUrl: './inventory-report.component.css',
    template: `
        <div class="pdf-container">
            <ng-container *ngIf="isLoading">
                <mat-progress-bar mode="indeterminate"></mat-progress-bar>
            </ng-container>

            <ng-container *ngIf="hasError">
                <p class="custom-error">An error occurred fetching report.</p>
            </ng-container>
            
            <div class='tool-container'>
                <button mat-fab extended color="primary" class="tool-button" aria-label="Back" (click)="handleNavBack()" matTooltip="Back to Inventory">
                    <mat-icon>arrow_back</mat-icon>
                    Back
                </button> 
            </div>
            <ng-container *ngIf="reportDataUrl">
                <iframe [src]="reportDataUrl | safe" class="pdf-view"></iframe>
            </ng-container>
        </div>
    `
})

export class InventoryReportComponent {
    reportFetchStatus?: FetchStatus
    reportDataUrl?: String
    isLoading?: Boolean = this.reportFetchStatus && this.reportFetchStatus === FetchStatus.Loading
    hasError?: Boolean = this.reportFetchStatus && this.reportFetchStatus === FetchStatus.Failed

    constructor(private store: Store<{inventoryReport: InventoryReportState}>, private router: Router){
    }

    ngOnInit(): void {
        this.store.select(state => state.inventoryReport).subscribe(s => {
            this.reportFetchStatus = s.fetchStatus;
            if(s.reportData){     
                const blb = new Blob([s.reportData], {type: 'application/pdf'});
                const url = URL.createObjectURL(blb);
                this.reportDataUrl = url;                
            }
        });
    }

    handleNavBack = (): void => {
        this.router.navigate(['/inventory'])
    }
}