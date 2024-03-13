import { createReducer, on } from "@ngrx/store";
import { createSelector } from '@ngrx/store';

import FetchStatus from "../../../constants/fetchStatus";
import Part from "../../parts/types/Part";
import InventoryItem from "../types/InventoryItem";
import InventoryTab from "../types/inventoryTab";
import { 
    setCurrentInventoryTab,
    createInventoryItem, createInventoryItemSuccess, createInventoryItemFail, 
    createInventoryItemList, createInventoryItemListSuccess, createInventoryItemListFail,
    fetchCurrentParts, fetchCurrentPartsSuccess, fetchCurrentPartsFail, 
    fetchInventory, fetchInventorySuccess, fetchInventoryFail } from "./inventory.actions";
import StocktakeItem from "../types/StocktakeItem";

export interface InventoryState {
    items: Array<InventoryItem>;
    totalItemCount: number;
    currentParts: Array<Part>;
    currentTab: InventoryTab;
    currentStockPage: number;
    historyStockPage: number;
    status: FetchStatus;
    error?: string | null;
};

export interface InventoryFetchOptions {
    isCurrent: boolean;
    page: number;
    takeAll: boolean;
}

const initialState: InventoryState = {
    items: [],
    totalItemCount: 0,
    currentParts: [],
    currentTab: InventoryTab.Entry,
    currentStockPage: 0,
    historyStockPage: 0,
    status: FetchStatus.Idle,
    error: null
};

export const inventoryReducer = createReducer(
    initialState,
    on(setCurrentInventoryTab, (state, {tab}) => ({...state, currentTab: tab})),
    on(createInventoryItem, (state) => ({...state, status: FetchStatus.Loading})),
    on(createInventoryItemSuccess, (state, {response}) => ({...state, status: response.hasError ? FetchStatus.Failed : FetchStatus.Succeeded, error: response.message })),
    on(createInventoryItemFail, (state, {response}) => ({...state, status: FetchStatus.Failed, error: response ? response.message : 'Failed to create item'})),
    on(createInventoryItemList, (state) => ({...state, status: FetchStatus.Loading})),
    on(createInventoryItemListSuccess, (state, {response}) => ({...state, status: response.hasError ? FetchStatus.Failed : FetchStatus.Succeeded, error: response.message })),
    on(createInventoryItemListFail, (state, {response}) => ({...state, status: FetchStatus.Failed, error: response ? response.message : 'Failed to create item list'})),
    on(fetchCurrentParts, (state) => ({...state, status: FetchStatus.Loading})),
    on(fetchCurrentPartsSuccess, (state, {response}) => ({...state, status: response.hasError ? FetchStatus.Failed : FetchStatus.Succeeded, error: response.message, currentParts: response.items})),
    on(fetchCurrentPartsFail, (state, {response}) => ({...state, status: FetchStatus.Failed, error: response.message})),
    on(fetchInventory, (state, {options}) => 
        {
            if(options.isCurrent) { 
                return { ...state, status: FetchStatus.Loading, currentStockPage: options.page } 
            }
            return { ...state, status: FetchStatus.Loading, historyStockPage: options.page } 
        }
    ),
    on(fetchInventorySuccess, (state, {response}) => ({...state, status: response.hasError ? FetchStatus.Failed : FetchStatus.Succeeded, error: response.message, totalItemCount: response.totalItemCount, items: response.items})),
    on(fetchInventoryFail, (state, {response}) => ({...state, status: FetchStatus.Failed, error: response.message}))
);

export const selectStocktakeItems = (state: InventoryState) => state.items.map(item => ({ partID: item.partID, partName: item.partName, quantity: 0 } as StocktakeItem));
export const selectInventoryStatus = (state: InventoryState) => state.status;
