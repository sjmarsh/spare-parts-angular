import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule, MatTabChangeEvent } from '@angular/material/tabs';
import { Store } from '@ngrx/store';

import { ManualStockEntryComponent } from '../manual-stock-entry/manual-stock-entry.component';
import { InventoryTableComponent } from '../inventory-table/inventory-table.component';
import { InventoryState } from '../store/inventory.reducers';
import InventoryTab from '../types/inventoryTab';
import { setCurrentInventoryTab } from '../store/inventory.actions';

@Component({
    selector: 'app-inventory-home',
    standalone: true,
    imports: [CommonModule, MatTabsModule, ManualStockEntryComponent, InventoryTableComponent],
    styleUrl: './inventory-home.component.css',
    template: `
        <div class="inventory-home">
            <h2>Inventory</h2>
            <mat-tab-group animationDuration="1000ms" [(selectedIndex)]="selectedTabIndex" (selectedTabChange)="onTabChanged($event);">
                <mat-tab label="Manual Stock Entry"> <app-manual-stock-entry></app-manual-stock-entry></mat-tab>
                <mat-tab label="Stocktake"><p>Stocktake</p></mat-tab>
                <mat-tab label="Current Stock">
                    <ng-template matTabContent>
                        <app-inventory-table id="current" [isCurrent]="true"></app-inventory-table>
                    </ng-template>
                </mat-tab>
                <mat-tab label="History">
                    <ng-template matTabContent>
                        <app-inventory-table id="history" [isCurrent]="false"></app-inventory-table>
                    </ng-template>
                </mat-tab>
            </mat-tab-group>
        </div>
  `})

export class InventoryHomeComponent {
    selectedTabIndex: number = 0
    
    constructor(private store: Store<{inventory: InventoryState}>){
    }

    ngOnInit(): void {
        this.store.select(s => s.inventory).subscribe(s => {
            this.setTab(s.currentTab);
        })
    }

    onTabChanged = (event: MatTabChangeEvent) => {
        let tab = this.getTab(event.index);
        this.store.dispatch(setCurrentInventoryTab({tab}));
    }

    setTab = (tab: InventoryTab): void => {
        switch(tab) {
            case InventoryTab.Entry: {
                this.selectedTabIndex = 0;
                break;
            }
            case InventoryTab.Stocktake: {
                this.selectedTabIndex = 1;
                break;
            }
            case InventoryTab.Current: {
                this.selectedTabIndex = 2;
                break;
            }
            case InventoryTab.History: {
                this.selectedTabIndex = 3;
                break;
            }
            default: {
                this.selectedTabIndex = 0;
                break;
            }
        }
    }

    getTab = (tabIndex: number): InventoryTab => {
        let tab = InventoryTab.Entry
        switch(tabIndex) {
            case 0: {
                tab = InventoryTab.Entry;
                break;
            }
            case 1: {
                tab = InventoryTab.Stocktake;
                break;
            }
            case 2: {
                tab = InventoryTab.Current;
                break;
            }
            case 3: {
                tab = InventoryTab.History;
                break;
            }
            default: {
                tab = InventoryTab.Entry;
                break;
            }
        }
        return tab;
    }
}