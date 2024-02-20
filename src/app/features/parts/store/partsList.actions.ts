import { createAction , props} from '@ngrx/store'

import PartListReponse from '../types/PartListResponse'

export const fetchParts = createAction('[PART] Fetch Parts', props<{page?: number | null}>())
export const fetchPartsSuccess = createAction('[PART] Fetch Parts Success', props<{partListResponse: PartListReponse}>())
export const fetchPartsFail = createAction('[PART] Fetch Parts Fail', props<{partListResponse: PartListReponse}>())
export const setCurrentPage = createAction('[PART] Set Current Page', props<{page: number}>())