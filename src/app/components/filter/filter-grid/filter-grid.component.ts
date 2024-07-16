import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';


import { FilterSelectorComponent } from '../filter-selector/filter-selector.component';
import FilterField from '../types/filterField';
import FilterFieldType from '../types/filterFieldType';
import FilterLine from '../types/filterLine';
import { FilterOperator, NamedFilterOperator, nameFilterOperatorsForStrings } from '../types/filterOperators';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { getUUid } from '../../../infrastructure/uuidHelper';
import PartCategory from '../../../features/parts/types/PartCategory';

@Component({
    selector: 'app-filter-grid',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatChipsModule, MatIconModule, FilterSelectorComponent, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule],
    styleUrl: './filter-grid.component.css',
    template: `
    <div>
        <ng-container *ngIf="filterFields">
            <div class="detail-margin">
                <details open="true">
                    <summary>Fields</summary>
                    <mat-card appearance="outlined">
                        <mat-card-content>
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
                        </mat-card-content>
                    </mat-card>
                </details>
            </div>
        </ng-container>
        <ng-container *ngIf="filterLines && filterFields && filterFormGroup">
            <div class="detail-margin">
                <details open="true">
                    <summary>Filters</summary>
                    <mat-card appearance="outlined">
                        <mat-card-content>
                        <form [formGroup]="filterFormGroup" (ngSubmit)="handleValidSubmit()">
                            @for(filterLine of filterLines; track filterLine) {
                                <app-filter-selector 
                                    [filterLine]="filterLine" 
                                    [fields]="filterFields"
                                    [onFilterLineChanged]="handleFilterLineChanged"
                                    [onRemoveFilter]="handleRemoveFilter">
                                </app-filter-selector>
                            }  
                            <button mat-button type="button" (click)="addEmptyFilter()">Add Filter</button>
                            <button mat-button type="button" (click)="search()">Search</button>
                        </form>
                        </mat-card-content>
                    </mat-card>
                </details>
            </div>
        </ng-container>
    </div>
    `
})

export class FilterGridComponent {
    
    MAX_FILTER_LINE_COUNT = 5;

    filterFields: FilterField[]
    filterLines: FilterLine[]
    filterFormGroup?: FormGroup


    constructor() {
        this.filterFields = [
            { id: getUUid(), name: 'One', type: FilterFieldType.StringType, isSelected: true } as FilterField,
            { id: getUUid(), name: 'Two', type: FilterFieldType.NumberType, isSelected: false } as FilterField, 
            { id: getUUid(), name: 'Three', type: FilterFieldType.EnumType, enumType: PartCategory, isSelected: false } as FilterField, 
        ]
        this.filterLines = [
            { id: getUUid(), selectedField: this.filterFields[0], selectedOperator: FilterOperator.Equal, value: 'test' } as FilterLine
        ]

        this.filterFormGroup = this.initForm(this.filterLines);

    }

    initForm = (filterLines: Array<FilterLine>): FormGroup => {
        const itemArray = new FormArray<FormGroup>([]);
        if(filterLines && filterLines.length > 0) {
            filterLines.forEach(f => {
                itemArray.push(new FormGroup({
                  id: new FormControl(f.id),
                  selectedField: new FormControl(f.selectedField),
                  selectedOperator: new FormControl(f.selectedOperator),
                  value: new FormControl(f.value)
                }))
            })
        }
        return new FormGroup({ items: itemArray });
    }

    handleToggleFilterField = (filterField: FilterField) => {
        console.log('FilterFieldToggle: ' + JSON.stringify(filterField));

    }

    handleFilterLineChanged = (filterLine: FilterLine) => {
        console.log('FilterLineChanged: ' + JSON.stringify(filterLine))
    }

    handleRemoveFilter = (filterLine: FilterLine) => {
        console.log('remove filter' + JSON.stringify(filterLine))
        if(filterLine && filterLine.id) {
            this.filterLines = this.filterLines.filter(f => f.id !== filterLine.id);
        } 
    }

    addEmptyFilter = () => {
        if(this.filterLines.length < this.MAX_FILTER_LINE_COUNT) {
            const newLine = { id: getUUid(), selectedField: this.filterFields[0], selectedOperator: FilterOperator.Equal, value: '' } as FilterLine
            this.filterLines = [...this.filterLines, newLine];
        }
    }

    search =  () => {

    }

    handleValidSubmit = () : void => {

    }
}