import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, ReactiveFormsModule, FormArray, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';

import { FilterGridComponent } from '../../../components/filter/filter-grid/filter-grid.component';
import FilterGridState from '../../../components/filter/types/filterGridState';
import Part from '../../parts/types/Part';
import GraphQLRequest from '../../../components/filter/types/graphQLRequest';
import { PagedData, PageInfo } from '../../../components/filter/types/pagedData';

@Component({
    selector: 'app-part-search',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, FilterGridComponent],
    styleUrl: './part-search.component.css',
    template: `
    <div class="part-search">
        <h2>Part Search</h2>
        <app-filter-grid [filterGridState]="filterGridState" rootGraphQLField="parts" [triggerServiceCall]="handleTriggerServiceCall"></app-filter-grid>
    </div>
    `
})

export class PartSearchComponent {

    filterGridState?: FilterGridState<Part>

    constructor() {
        this.filterGridState = {
            filterFields: [],
            filterLines: [],
            currentResultPage: 1,
            isFieldsSelectionVisible: true,
            isFiltersEntryVisible: true,
            filterResults: { items: new Array<Part>(), pageInfo: { hasNextPage: false } as PageInfo, totalCount: 0 } as PagedData<Part>
        }
    }

    handleOnFilterGridStateChanged = (filterGridState: FilterGridState<Part>)  => {
        //dispatch(updateFilterGridState(filterGridState));        
    }

    handleTriggerServiceCall = (graphQLRequest: GraphQLRequest) => {
        console.log(graphQLRequest)
        //dispatch(partSearch(graphQLRequest));
    }
}