import { createAction , props} from '@ngrx/store'
import { InventoryFetchOptions } from './inventory.reducers'
import InventoryTab from '../types/inventoryTab'
import InventoryItemListResponse from '../types/InventoryItemListResponse'
import InventoryItem from '../types/InventoryItem'
import InventoryItemResponse from '../types/InventoryItemResponse'
import PartListReponse from '../../parts/types/PartListResponse'

export const setCurrentInventoryTab = createAction('[INVENTORY] Set Current Tab', props<{tab: InventoryTab}>())

export const fetchInventory = createAction('[INVENTORY] Fetch Inventory', props<{options: InventoryFetchOptions}>())
export const fetchInventorySuccess = createAction('[INVENTORY] Fetch Inventory Success', props<{response: InventoryItemListResponse}>())
export const fetchInventoryFail = createAction('[INVENTORY] Fetch Inventory Fail', props<{response: InventoryItemListResponse}>())

export const createInventoryItem = createAction('[INVENTORY] Create Inventory Item', props<{item: InventoryItem}>())
export const createInventoryItemSuccess = createAction('[INVENTORY] Create Inventory Item Success', props<{response: InventoryItemResponse}>())
export const createInventoryItemFail = createAction('[INVENTORY] Create Inventory Item', props<{response: InventoryItemResponse}>())

export const fetchCurrentParts = createAction('[INVENTORY] Fetch Current Parts')
export const fetchCurrentPartsSuccess = createAction('[INVENTORY] Fetch Current Parts Success', props<{response: PartListReponse}>())
export const fetchCurrentPartsFail = createAction('[INVENTORY] Fetch Current Parts Fail', props<{response: PartListReponse}>())

export const createInventoryItemList = createAction('[IVENTORY] Create Inventory Item List', props<{items: Array<InventoryItem>}>())
export const createInventoryItemListSuccess = createAction('[IVENTORY] Create Inventory Item List Success', props<{response: InventoryItemListResponse}>())
export const createInventoryItemListFail = createAction('[IVENTORY] Create Inventory Item List Fail', props<{response: InventoryItemListResponse}>())