import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
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
            <mat-select name="field" formControlName="selectedField" (selectionChange)="handleFieldChanged($event)">
                <mat-option *ngFor="let field of fields" [value]="selectedField.id">{{field.name}}</mat-option>
            </mat-select>       
        </mat-form-field>
        <mat-form-field>
            <mat-label>Operator</mat-label>
            <mat-select name="operator" formControlName="selectedOperator" (selectionChange)="handleOperatorChanged($event)">
                <mat-option *ngFor="let operator of operators" [value]="selectedOperator">{{operator.name}}</mat-option>
            </mat-select>       
        </mat-form-field>
        <mat-form-field>
            <mat-label>Value</mat-label>
            <ng-container *ngIf="selectedFieldIsEnumType(); else notAnEnum ">
                <mat-select name="value" formControlName="value" (selectionChange)="handleEnumValueChanged($event)">
                    <mat-option *ngFor="let enumItem of getEnumItems(selectedField.enumType)" [value]="enumItem">{{enumItem}}</mat-option>
                </mat-select>
            </ng-container>
            <ng-template #notAnEnum>
                <input matInput formControlName="value" [value]="value"/>
            </ng-template>
            
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
    selectedOperator: NamedFilterOperator
    operators: Array<NamedFilterOperator>
    value: String

    constructor() {
        this.selectedField = { type: FilterFieldType.StringType  } as FilterField;
        this.operators = [];
        this.updateOperators();
        this.selectedOperator = this.operators[0];
        this.value = ""

        
    }

    ngOnInit(): void {   
        console.log(this.filterLine)
        if(this.filterLine){
            this.selectedField = this.filterLine.selectedField
            this.updateOperators();
            this.selectedOperator = this.operators.find(o => o.filterOperator === this.filterLine?.selectedOperator) ?? this.operators[0];
            this.value = this.filterLine.value
        }
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
        if(this.filterLine && this.onRemoveFilter){
            this.onRemoveFilter(this.filterLine)
        }
    }

    handleFieldChanged = (e: MatSelectChange) => {        
        if(e && e.value && this.fields && this.filterLine && this.onFilterLineChanged) {
            this.selectedField = this.fields.find(f => f.id === e.value) ?? this.selectedField;
            this.filterLine = {...this.filterLine, selectedField: this.selectedField};
            this.onFilterLineChanged(this.filterLine);
        }
        this.updateOperators();
    }

    handleOperatorChanged = (e: MatSelectChange) => {
        const newOperatorSelection = e.value as NamedFilterOperator
        if(newOperatorSelection && this.filterLine && this.onFilterLineChanged) {
            this.selectedOperator = newOperatorSelection;
            this.filterLine = {...this.filterLine, selectedOperator: newOperatorSelection.filterOperator};
            this.onFilterLineChanged(this.filterLine);
        }
        
    }

    selectedFieldIsEnumType = () : boolean => {
        return this.selectedField.enumType !== undefined && this.selectedField.type === FilterFieldType.EnumType 
    }

    getEnumItems = (enumType: object | undefined) : Array<string> => {
        let items = new Array<string>();
        for(const item in enumType){
            items.push(item);
        }
        return items;
    }

    handleEnumValueChanged = (e: MatSelectChange) => {
        if(this.filterLine && e.value && this.onFilterLineChanged) {
            this.filterLine = {...this.filterLine, value: e.value};
            this.onFilterLineChanged(this.filterLine);
        }
    }
}