import { createAction , props} from '@ngrx/store'
import Part from '../types/Part'
import DetailMode from '../../../constants/detailMode'
import PartResponse from '../types/PartResponse'

export const showDetail = createAction('[PART] Show Detail', props<{mode: DetailMode}>())
export const hideDetail = createAction('[PART] Hide Detail')

export const fetchPart = createAction('[PART] Fetch Part', props<{partId: number}>())
export const fetchPartSuccess = createAction('[PART] Fetch Part Success', props<{part: Part}>())
export const fetchPartFail = createAction('[PART] Fetch Part Fail')

export const createPart = createAction('[PART] Create Part', props<{part: Part}>())
export const createPartSuccess = createAction('[PART] Create Part Success', props<{partResponse: PartResponse}>())
export const createPartFail = createAction('[PART] Create Part Fail', props<{partResponse: PartResponse}>())

export const updatePart = createAction('[PART] Update Part', props<{part: Part}>())
export const updatePartSuccess = createAction('[PART] Update Part Success', props<{partResponse: PartResponse}>())
export const updatePartFail = createAction('[PART] Update Part Fail', props<{partResponse: PartResponse}>())

export const deletePart = createAction('[PART] Delete Part', props<{partId: number}>())
export const deletePartSuccess = createAction('[PART] Delete Part Success', props<{partResponse: PartResponse}>())
export const deletePartFail = createAction('[PART] Delete Part Fail', props<{partResponse: PartResponse}>())