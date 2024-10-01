import { createReducer, on } from "@ngrx/store";
import FilterLine from "../../../../components/filter/types/filterLine";
import FilterGridState from "../../../../components/filter/types/filterGridState";
import { FilterOperator } from "../../../../components/filter/types/filterOperators";
import FetchStatus from "../../../../constants/fetchStatus";
import { getUUid } from "../../../../infrastructure/uuidHelper";
import { PagedData, PageInfo } from "../../../../components/filter/types/pagedData";
import Part from "../../../parts/types/Part";
import { partFields } from "../types/partFields";
import { partSearch, partSearchFail, partSearchSuccess, updateFilterGridState } from "./partSearch.actions";

export interface PartSearchState {
    filterGridState: FilterGridState<Part>
    status: FetchStatus
    error?: string | null
}

const initialState : PartSearchState = {
    filterGridState: {
        filterFields: partFields(),
        filterLines: new Array<FilterLine>( { id: getUUid(), selectedField: partFields()[0], selectedOperator: FilterOperator.Equal, value: '' } as FilterLine ),
        currentResultPage: 0,
        isFieldsSelectionVisible: true,
        isFiltersEntryVisible: true,
        filterResults: { items: new Array<Part>(), pageInfo: { hasNextPage: false } as PageInfo, totalCount: 0 } as PagedData<Part>
    } as FilterGridState<Part>,
    status: FetchStatus.Idle,
    error: null
}

export const partSearchReducer = createReducer(
    initialState, 
    on(partSearch, (state) => ({...state, status: FetchStatus.Loading})),
    on(partSearchSuccess, (state, {response}) => ({...state, 
        status: FetchStatus.Succeeded, 
        filterGridState: {...state.filterGridState, filterResults: response.data?.parts}
    })),
    on(partSearchFail, (state) => ({...state, status: FetchStatus.Failed})),
    on(updateFilterGridState, (state, {updatedState}) => ({...state, filterGridState: updatedState }))
)