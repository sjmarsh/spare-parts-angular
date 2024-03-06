import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
    selector: 'app-inventory-home',
    standalone: true,
    imports: [CommonModule, MatTabsModule],
    template: `
        <div>
            <h2>Inventory</h2>
            <mat-tab-group animationDuration="2000ms">
                <mat-tab label="Manual Stock Entry" ><p>Manual Stock Entry</p></mat-tab>
                <mat-tab label="Stocktake"><p>Stocktake</p></mat-tab>
                <mat-tab label="Current Stock"><p>Current Stock</p></mat-tab>
                <mat-tab label="History"><p>Stock History</p></mat-tab>
            </mat-tab-group>
        </div>
  `})

export class InventoryHomeComponent {

}