import { createReducer, on } from "@ngrx/store";

import FetchStatus from "../../../constants/fetchStatus";
import { fetchReport, fetchReportSuccess, fetchReportFail } from "../store/inventoryReport.actions";

export interface InventoryReportState {
    reportData?: ArrayBuffer | null,
    fetchStatus: FetchStatus,
    message?: string | null
};

const initialState: InventoryReportState = {
    reportData: null,
    fetchStatus: FetchStatus.Idle,
    message: null
};

export const inventoryReportRecuder = createReducer(
    initialState,
    on(fetchReport, (state) => ({...state, fetchStatus: FetchStatus.Loading})),
    on(fetchReportSuccess, (state, { reportData }) => ({...state, reportData: reportData, fetchStatus: FetchStatus.Succeeded})),
    on(fetchReportFail, (state) => ({...state, fetchStatus: FetchStatus.Failed}))
);