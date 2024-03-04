import { createAction , props} from '@ngrx/store'

export const fetchReport = createAction('[PART] Fetch Report')
export const fetchReportSuccess = createAction('[PART] Fetch Report Success', props<{reportData: ArrayBuffer}>())
export const fetchReportFail = createAction('[PART] Fetch Report Fail')