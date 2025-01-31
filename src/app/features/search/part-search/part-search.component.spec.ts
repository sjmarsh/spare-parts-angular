import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideMockStore, MockStore } from '@ngrx/store/testing';

import { PartSearchState } from './store/partSearch.reducers';
import { PartSearchComponent } from './part-search.component';
import FilterGridState from '../../../components/filter/types/filterGridState';
import PartAttribute from '../../parts/types/PartAttribute';
import Part from '../../parts/types/Part';
import FetchStatus from '../../../constants/fetchStatus';
import FilterField from '../../../components/filter/types/filterField';
import FilterLine from '../../../components/filter/types/filterLine';
import { partSearch, updateFilterGridState } from './store/partSearch.actions';
import GraphQLRequest from '../../../components/filter/types/graphQLRequest';

describe('PartSearchComponent', () => {
    let component: PartSearchComponent;
    let fixture: ComponentFixture<PartSearchComponent>;
    let store: MockStore;

    const initialFilterGridState = {
        filterFields: [] as Array<FilterField>,
        filterLines: [] as Array<FilterLine>,
        isFieldsSelectionVisible: true,
        isFiltersEntryVisible: true,
        currentResultPage: 0 
    } as FilterGridState<Part, PartAttribute>

    const initialState = { 
        filterGridState: initialFilterGridState,
        status: FetchStatus.Succeeded,
        error: ''
    } as PartSearchState

    beforeEach(async() => {
        await TestBed.configureTestingModule({
            imports: [PartSearchComponent],
            providers: [provideAnimations(), provideMockStore({initialState})]
        })
        .compileComponents();

        store = TestBed.inject(MockStore);
        fixture = TestBed.createComponent(PartSearchComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    })

    it('should create', () => {
        expect(component).toBeTruthy();
    })

    it('should display title', () => {
        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.querySelector('h2')?.textContent).toContain('Part Search');
    })

    it('should initialize filter grid state', () => {
        expect(component.filterGridState).toEqual(initialFilterGridState);
    })

    it('should handle filter grid state change', () =>  {
        const dispatchedSpy = spyOn(store, 'dispatch');
        const updatedState = { } as FilterGridState<Part, PartAttribute>;
        component.handleOnFilterGridStateChanged(updatedState);
        expect(dispatchedSpy).toHaveBeenCalledWith(updateFilterGridState({updatedState}))
    })

    it('should handle trigger service call', () => {
        const dispatchedSpy = spyOn(store, 'dispatch');
        const graphQLRequest = {} as GraphQLRequest
        component.handleTriggerServiceCall(graphQLRequest);
        expect(dispatchedSpy).toHaveBeenCalledWith(partSearch({graphQLRequest}));
    })
})

