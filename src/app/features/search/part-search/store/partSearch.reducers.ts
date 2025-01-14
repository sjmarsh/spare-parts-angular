import { createReducer, on } from "@ngrx/store";
import FilterLine from "../../../../components/filter/types/filterLine";
import FilterGridState from "../../../../components/filter/types/filterGridState";
import { FilterOperator } from "../../../../components/filter/types/filterOperators";
import FetchStatus from "../../../../constants/fetchStatus";
import { getUUid } from "../../../../infrastructure/uuidHelper";
import { PageInfo } from "../../../../components/filter/types/pagedData";
import { DataRow, ReportData } from "../../../../components/filter/types/reportData";
import Part from "../../../parts/types/Part";
import PartAttribute from "../../../parts/types/PartAttribute";
import { partFields } from "../types/partFields";
import { PartGraphQLResponsePaged } from "../types/partGraphQLResponsePaged";
import { PartGraphQLResponsePagedItems } from "../types/partGraphQLResponsePaged";
import { partSearch, partSearchFail, partSearchSuccess, updateFilterGridState } from "./partSearch.actions";

export interface PartSearchState {
    filterGridState: FilterGridState<Part, PartAttribute>
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
        filterResults: { items: new Array<DataRow<Part, PartAttribute>>(), pageInfo: { hasNextPage: false } as PageInfo, totalCount: 0 } as ReportData<Part, PartAttribute>
    } as FilterGridState<Part, PartAttribute>,
    status: FetchStatus.Idle,
    error: null
}

const getFilterResults = ({ parts: searchResult }: { parts: PartGraphQLResponsePagedItems | null | undefined; }): ReportData<Part, PartAttribute> | null | undefined => {
    if(searchResult)
    { 
        return {
            items: searchResult.items.map(i => ({ item: i, details: i.attributes })),
            pageInfo: searchResult.pageInfo,
            error: searchResult.error,
            totalCount: searchResult.totalCount
        }
    }
    return searchResult;
}


export const partSearchReducer = createReducer(
    initialState, 
    on(partSearch, (state) => ({...state, status: FetchStatus.Loading})),
    on(partSearchSuccess, (state, {response}) => ({...state, 
        status: FetchStatus.Succeeded, 
        filterGridState: {...state.filterGridState, filterResults: getFilterResults({ parts: response.data?.parts })}
    })),
    on(partSearchFail, (state) => ({...state, status: FetchStatus.Failed})),
    on(updateFilterGridState, (state, {updatedState}) => ({...state, filterGridState: updatedState }))
)


