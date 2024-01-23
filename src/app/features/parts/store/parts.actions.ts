import { createAction , props} from '@ngrx/store'
import { ShowDetailPayload } from '../types/ShowDetailPayload'
import Part from '../types/Part'

export const showDetail = createAction('[PART] Show Detail', props<{payload: ShowDetailPayload}>())
export const hideDetail = createAction('[PART] Hide Detail')

export const fetchPart = createAction('[PART] Fetch Part', props<{partId: number}>())
export const fetchPartSuccess = createAction('[PART] Fetch Part Success', props<{part: Part}>())
export const fetchPartFail = createAction('[PART] Fetch Part Fail')