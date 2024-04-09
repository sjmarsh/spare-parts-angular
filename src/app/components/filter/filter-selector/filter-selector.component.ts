import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

import FilterField from '../types/filterField';
import FilterLine from '../types/filterLine';
import { NamedFilterOperator, nameFilterOperatorsForStrings, namedFilterOperatorsForDatesAndNumbers } from '../types/filterOperators';
import FilterFieldType from '../types/filterFieldType';

@Component({
    selector: 'app-filter-selector',
    standalone: true,
    imports: [CommonModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule],
    styleUrl: './filter-selector.component.css',
    template: `
        <mat-form-field>
            <mat-label>Field</mat-label>
            <mat-select name="field" formControlName="selectedField">
                <mat-option *ngFor="let field of fields" [value]="field.name">{{field.name}}</mat-option>
            </mat-select>       
        </mat-form-field>
        <mat-form-field>
            <mat-label>Operator</mat-label>
            <mat-select name="operator" formControlName="selectedOperator">
                <mat-option *ngFor="let operator of operators" [value]="operator">{{operator.name}}</mat-option>
            </mat-select>       
        </mat-form-field>
        <mat-form-field>
            <mat-label>Value</mat-label>
            <input matInput formControlName="value"/>
        </mat-form-field>
        <button mat-flat-button type="button" (click)="deleteFilter()" value="deleteFilter">Delete</button>
    `
})

export class FilterSelectorComponent {
    
    @Input({required: true}) fields?: Array<FilterField>
    @Input({required: true}) filterLine?: FilterLine
    @Input() onFilterLineChanged?: (filterLine: FilterLine) => void | null
    @Input() onRemoveFilter?: (filterLine: FilterLine) => void | null

    selectedField: FilterField
    operators: Array<NamedFilterOperator>

    constructor() {
        this.selectedField = { type: FilterFieldType.StringType } as FilterField
        this.operators = []
        this.updateOperators();
    }

    updateOperators = () => {
        if(this.selectedField.type === FilterFieldType.NumberType || this.selectedField.type === FilterFieldType.DateType){
            this.operators = namedFilterOperatorsForDatesAndNumbers();
        }
        else {
            this.operators = nameFilterOperatorsForStrings();
        }
    }

    deleteFilter = () => {
        console.log('delete')
        if(this.filterLine && this.onRemoveFilter){
            console.log('=> go')
            this.onRemoveFilter(this.filterLine)
        }
    }

}