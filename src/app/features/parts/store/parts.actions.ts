import { createAction , props} from '@ngrx/store'
import { ShowDetailPayload } from '../types/ShowDetailPayload'

export const showDetail = createAction('[PART] Show Detail', props<{payload: ShowDetailPayload}>())
