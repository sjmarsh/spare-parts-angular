import { createReducer, on } from "@ngrx/store";

import FetchStatus from "../../../constants/fetchStatus";
import { fetchReport, fetchReportSuccess, fetchReportFail } from "./partsReport.actions";

export interface PartReportState {
    reportData?: ArrayBuffer | null,
    fetchStatus: FetchStatus
};

const initialState: PartReportState = {
    reportData: null,
    fetchStatus: FetchStatus.Idle
};

export const partsReportReducer = createReducer(
    initialState,
    on(fetchReport, (state) => ({...state, fetchStatus: FetchStatus.Loading})),
    on(fetchReportSuccess, (state, { reportData }) => ({...state, reportData: reportData, fetchStatus: FetchStatus.Succeeded})),
    on(fetchReportFail, (state) => ({...state, fetchStatus: FetchStatus.Failed}))
)