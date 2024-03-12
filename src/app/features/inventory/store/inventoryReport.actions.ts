import { createAction , props} from '@ngrx/store'

export const fetchReport = createAction('[INVENTORY] Fetch Report', props<{isCurrent: boolean}>())
export const fetchReportSuccess = createAction('[INVENTORY] Fetch Report Success', props<{reportData: ArrayBuffer}>())
export const fetchReportFail = createAction('[INVENTORY] Fetch Report Fail')