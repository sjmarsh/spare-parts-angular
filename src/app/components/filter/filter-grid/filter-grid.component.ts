import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

import { FilterSelectorComponent } from '../filter-selector/filter-selector.component';
import FilterField from '../types/filterField';
import FilterGridState from '../types/filterGridState';
import FilterLine from '../types/filterLine';
import { FilterOperator } from '../types/filterOperators';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { getUUid } from '../../../infrastructure/uuidHelper';
import { GraphQLBuilder } from '../services/graphQLRequestBuilder';
import GraphQLRequest from '../types/graphQLRequest';
import { HumanizePipe } from '../../../infrastructure/humanizePipe';
import PageOffset from '../types/pageOffset';
import { updateArrayItem } from '../../../infrastructure/arrayHelper';
import TableSettings from '../../../constants/tableSettings';
import { DataRow } from '../types/reportData';

@Component({
    selector: 'app-filter-grid',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatChipsModule, MatIconModule, FilterSelectorComponent, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatTableModule, MatPaginatorModule, HumanizePipe],
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
                                    {{filterField.name | humanize}}
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
        <ng-container *ngIf="filterGridState.filterResults?.items">
            <div class="results-margin">
                <details open="true">
                <summary>Results</summary>
                    <table mat-table [dataSource]="filterGridState.filterResults?.items || []" multiTemplateDataRows>
                        <ng-container *ngFor="let col of displayedColumns" [matColumnDef]=col>
                            <ng-container *ngIf="col !== 'detailToggle' ">
                                <th mat-header-cell *matHeaderCellDef >{{col | humanize}}</th>
                                <td mat-cell *matCellDef="let element">{{element.item[col]}}</td>
                            </ng-container>
                            <ng-container *ngIf="col == 'detailToggle' ">
                                <th mat-header-cell *matHeaderCellDef >Details</th>
                                <td mat-cell *matCellDef="let element">
                                    <button mat-icon-button aria-label="Expand Details" (click)="toggleDetail(element)">
                                        <mat-icon>unfold_more</mat-icon>
                                    </button>
                                </td>
                            </ng-container>
                        </ng-container>
                        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
                       
                        <!-- Detail row -->
                        <!-- Ref: https://stackblitz.com/edit/angular-nested-mat-table?file=app%2Ftable-expandable-rows-example.html -->
                        <ng-container matColumnDef="expandedDetail" >
                            <td mat-cell *matCellDef="let element" [attr.colspan]="displayedColumns.length">
                                <div class="element-detail" *ngIf="element.details.length > 0 && element.isDetailsVisible" >
                                    <p class="element-detail-header">Attributes<p>
                                    <table #innerTables mat-table [dataSource]="element.details">
                                        <ng-container matColumnDef="{{innerColumn}}" *ngFor="let innerColumn of displayedDetailColumns">
                                            <th mat-header-cell *matHeaderCellDef mat-sort-header> {{innerColumn | humanize}} </th>
                                            <td mat-cell *matCellDef="let element"> {{element[innerColumn]}} </td>
                                        </ng-container>
                                        <tr mat-header-row *matHeaderRowDef="displayedDetailColumns"></tr>
                                        <tr mat-row *matRowDef="let row; columns: displayedDetailColumns;"></tr>
                                    </table>
                                </div>
                            </td>
                        </ng-container>                        
                        <tr mat-row *matRowDef="let row; columns: ['expandedDetail']" class="detail-row"></tr>
                    </table>
                    <mat-paginator
                        (page)="handlePageEvent($event)"
                        [length]="filterGridState.filterResults?.totalCount ?? 0"
                        [pageSize]="pageSize"
                        [pageIndex]="currentPage"
                        [showFirstLastButtons]="true"
                        aria-label="Search results"
                    >
                    </mat-paginator>
                </details>
            </div>
        </ng-container>

    </div>
    `
})

export class FilterGridComponent<T, TD> {

    @Input({required: true}) filterGridState: FilterGridState<T, TD>;
    @Input({required: true}) rootGraphQLField: string;
    @Input({required: true}) triggerServiceCall?: (graphQLRequest: GraphQLRequest) => void | null;
    @Input({required: true}) onFilterStateChanged?: (filterGridState: FilterGridState<T, TD>) => void | null;
            
    MAX_FILTER_LINE_COUNT = 5;

    filterFields: Array<FilterField>
    filterLines: Array<FilterLine>
    filterFormGroup?: FormGroup
    displayedColumns: Array<string>
    displayedDetailColumns: Array<string>
    
    pageSize: number = TableSettings.PageSize
    currentPage: number = 0
    
    constructor(private graphQLBuilder: GraphQLBuilder) {
        this.filterFields = [];
        this.filterLines = [];
        this.filterGridState =  { filterFields: this.filterFields, filterLines: this.filterLines, isFieldsSelectionVisible: true, isFiltersEntryVisible: true, currentResultPage: 0 };
        this.rootGraphQLField = '';
        this.displayedColumns = [];
        this.displayedDetailColumns = [];
        this.initFilters();
    }

    ngOnInit(): void { 
        this.initFilters();
    }

    initFilters = () => {
        console.log('InitFilters')
        this.filterFields = this.filterGridState?.filterFields || [];
        this.filterLines = this.filterGridState?.filterLines || [];
        this.currentPage = this.filterGridState.currentResultPage;
        this.filterFormGroup = this.initForm(this.filterLines);
        this.displayedColumns = this.getDisplayColumns();
        this.displayedDetailColumns = this.getDetailDisplayColumns();
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

    updateFilterGridState = (filterGridState: FilterGridState<T, TD>) => {
        if(this.onFilterStateChanged) {
            return this.onFilterStateChanged(filterGridState);
        }        
    }

    handleToggleFilterField = (filterField: FilterField) => {
        const isFilterSelected = this.filterLines.find(f => f.selectedField.id === filterField.id);
            if(!isFilterSelected) {  // don't toggle chip if the filter is in use
                let itemToToggle = this.filterFields.find(f => f.id === filterField.id);
                if(itemToToggle) {
                    const itemToUpdate = { ... itemToToggle };
                    itemToUpdate.isSelected = !itemToToggle.isSelected;
                    let state = { ... this.filterGridState };
                    state.filterFields = updateArrayItem<FilterField>(state.filterFields, itemToUpdate);                    
                    this.updateFilterGridState(state);
                    this.filterFields = state.filterFields;
                    this.displayedColumns = this.getDisplayColumns();
                    this.displayedDetailColumns = this.getDetailDisplayColumns();
                }
            }
    }

    handleFilterLineChanged = (filterLine: FilterLine) => {
        if(this.filterLines.find(f => f.id == filterLine.id)) {
            // update
            this.filterLines = updateArrayItem<FilterLine>(this.filterLines, filterLine);
            this.updateFilterGridState({...this.filterGridState, filterLines: this.filterLines });
        }
        else {
            // add
            this.filterLines = [ ... this.filterLines, filterLine ];
            this.updateFilterGridState({ ... this.filterGridState, filterLines: this.filterLines });
        }
    }

    handleRemoveFilter = (filterLine: FilterLine) => {
        if(filterLine && filterLine.id) {
            this.filterLines = this.filterLines.filter(f => f.id !== filterLine.id);
            this.updateFilterGridState({ ... this.filterGridState, filterLines: this.filterLines})
        } 
    }

    addEmptyFilter = () => {
        if(this.filterLines.length < this.MAX_FILTER_LINE_COUNT) {
            const newLine = { id: getUUid(), selectedField: this.filterFields[0], selectedOperator: FilterOperator.Equal, value: '' } as FilterLine
            this.filterLines = [...this.filterLines, newLine];
        }
    }

    search = () => {
        // todo validate
        console.log('Search')
        if(this.filterGridState && this.triggerServiceCall) {
            const currentResultPage = this.currentPage + 1;
            const pageOffset = { skip: currentResultPage * TableSettings.PageSize - TableSettings.PageSize, take: TableSettings.PageSize } as PageOffset;
            const graphQLRequest = this.graphQLBuilder.build(this.filterLines, this.filterFields, this.rootGraphQLField, pageOffset)
            this.triggerServiceCall(graphQLRequest);
        }
    }

    handlePageEvent = (e: PageEvent) => {
        console.log('handle page: ' + e.pageIndex)
        this.currentPage = e.pageIndex;
        this.updateFilterGridState({...this.filterGridState, currentResultPage: this.currentPage });
        this.search();
      }

    handleValidSubmit = () : void => {
        this.search();
    }

    getDisplayColumns = () : Array<string> => {
        let columns =  [... new Set(this.filterFields.filter(f => f.isSelected === true && (f.parentFieldName === undefined || f.parentFieldName?.length == 0)).map(f => f.name))];
        columns.push('detailToggle');
        return columns;
    }

    getDetailDisplayColumns = () : Array<string> => {
        return [... new Set(this.filterFields.filter(f => f.isSelected === true && (f.parentFieldName && f.parentFieldName.length > 0)).map(f => f.name))];
    }

    toggleDetail(row: DataRow<T, TD>) {
        if(this.filterGridState.filterResults) {
            
            let item = {...row};
            item.isDetailsVisible = !item.isDetailsVisible;

            let filterResultsState = {...this.filterGridState.filterResults};
            let updatedItems = updateArrayItem(filterResultsState.items, item);
            filterResultsState.items = updatedItems;

            this.updateFilterGridState({...this.filterGridState, filterResults:  filterResultsState});
        }
    }
    
}