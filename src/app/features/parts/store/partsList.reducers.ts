import { createReducer, on } from "@ngrx/store";

import Part from "../types/Part";
import FetchStatus from "../../../constants/fetchStatus";
import { fetchParts, fetchPartsSuccess, fetchPartsFail, setCurrentPage } from "./partsList.actions";

export interface PartListState {
    items: Array<Part>
    totalItemCount: number
    currentPage: number
    status: string
    hasError: boolean
    error?: string | null
}

const initialState : PartListState = {
    items: [],
    totalItemCount: 0,
    currentPage: 0,
    status: FetchStatus.Idle,
    hasError: false,
    error: null
}

export const partListReducer = createReducer(
    initialState,
    on(fetchParts, (state) => ({...state, status: FetchStatus.Loading})),
    on(fetchPartsSuccess, (state, {partListResponse}) => ({
        ...state, 
        items: partListResponse.items, 
        totalItemCount: partListResponse.totalItemCount, 
        hasError: partListResponse.hasError, 
        error: partListResponse.message,
        status: partListResponse.hasError ? FetchStatus.Failed : FetchStatus.Succeeded
     })),
     on(fetchPartsFail, (state, {partListResponse}) => ({
        ...state, 
        items: [], 
        totalItemCount: 0, 
        hasError: true, 
        error: partListResponse.message ?? 'Error occurred fetching parts.',
        status: FetchStatus.Failed
     })),
     on(setCurrentPage, (state, {page}) => ({
        ...state,
        currentPage: page
     }))
)
