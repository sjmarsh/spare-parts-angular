import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

import FilterField from '../types/filterField';
import FilterFieldType from '../types/filterFieldType';
import { getUUid } from '../../../infrastructure/uuidHelper';

@Component({
    selector: 'app-filter-grid',
    standalone: true,
    imports: [CommonModule, MatCardModule, MatChipsModule, MatIconModule],
    styleUrl: './filter-grid.component.css',
    template: `
    <div>
        <ng-container *ngIf="filterFields">
            <details>
                <summary>Fields</summary>
                <mat-card>
                <mat-chip-listbox aria-label="Select Fields">
                @for (filterField of filterFields; track filterField) {
                    <mat-chip-option 
                        [selected]="filterField.isSelected"
                        (click)="handleToggleFilterField(filterField)"
                        color="warm">
                        {{filterField.name}}
                    </mat-chip-option>
                }
                </mat-chip-listbox>
                </mat-card>
            </details>
        </ng-container>
    </div>
    `
})

export class FilterGridComponent {
    
    filterFields: FilterField[]

    constructor() {
        this.filterFields = [
            { id: getUUid(), name: 'One', type: FilterFieldType.StringType, isSelected: true } as FilterField,
            { id: getUUid(), name: 'Two', type: FilterFieldType.StringType, isSelected: false } as FilterField
        ]
    }

    handleToggleFilterField = (filterField: FilterField) => {
        console.log(filterField);

    }
}