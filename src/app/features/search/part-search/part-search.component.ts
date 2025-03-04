import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';

import { FilterGridComponent } from '../../../components/filter/filter-grid/filter-grid.component';
import FilterGridState from '../../../components/filter/types/filterGridState';
import GraphQLRequest from '../../../components/filter/types/graphQLRequest';
import Part from '../../parts/types/Part';
import PartAttribute from '../../parts/types/PartAttribute';
import { partSearch, updateFilterGridState } from './store/partSearch.actions';
import { PartSearchState } from './store/partSearch.reducers';
import FetchStatus from '../../../constants/fetchStatus';

@Component({
    selector: 'app-part-search',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, FilterGridComponent],
    styleUrl: './part-search.component.css',
    template: `
    <div class="part-search">
        <h2>Part Search</h2>
        <app-filter-grid [filterGridState]="filterGridState" rootGraphQLField="parts" [triggerServiceCall]="handleTriggerServiceCall" [onFilterStateChanged]="handleOnFilterGridStateChanged"></app-filter-grid>
    </div>
    `
})

export class PartSearchComponent {

    filterGridState: FilterGridState<Part, PartAttribute>

    constructor(private store: Store<{partSearch: PartSearchState}>) {
        this.filterGridState = { filterFields: [], filterLines: [], isFieldsSelectionVisible: true, isFiltersEntryVisible: true, currentResultPage: 0 };
    }

    ngOnInit(): void { 
        this.store.select(state => state.partSearch)
            .subscribe(s => {
                if(s) {
                    console.log('part-search subs')
                    this.filterGridState = s.filterGridState;
                    if(s && s.status == FetchStatus.Idle) {
                       // refetch
                    }
                    if(s.status === FetchStatus.Succeeded){
                        console.log('part-search success')
                    //   
                    }
                    if(s.status === FetchStatus.Failed){
                    //
                    }
                }
                                
            })
    }
    

    handleOnFilterGridStateChanged = (updatedState: FilterGridState<Part, PartAttribute>)  => {
        this.store.dispatch(updateFilterGridState({updatedState}));
    }

    handleTriggerServiceCall = (graphQLRequest: GraphQLRequest) => {
        this.store.dispatch(partSearch({graphQLRequest}));
    }
}