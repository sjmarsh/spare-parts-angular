import { createReducer, on } from "@ngrx/store";

import Part from "../types/Part";
import PartAttribute from "../types/PartAttribute";
import DetailMode from "../../../constants/detailMode";
import FetchStatus from "../../../constants/fetchStatus";
import { hideDetail, showDetail, fetchPart, fetchPartSuccess, fetchPartFail } from "./parts.actions";

// ref: https://www.syncfusion.com/blogs/post/angular-state-management-ngrx.aspx


export interface PartDetailState {
    id: number
    value: Part
    mode: DetailMode
    status: FetchStatus
    error?: string | null
}

const initialState : PartDetailState = {
    id: 0,
    value: { attributes: new Array<PartAttribute> } as Part,
    mode: DetailMode.Closed,
    status: FetchStatus.Idle,
    error: null
};

export const partReducer = createReducer(
    initialState,
    on(showDetail, (state, { payload }) => ({ ...state, id: payload.id, mode: payload.mode })),
    on(hideDetail, (state) => ({...state, id: 0, mode: DetailMode.Closed})),
    on(fetchPart, (state) => ({...state, status: FetchStatus.Loading})),
    on(fetchPartSuccess, (state, { part }) => ({...state, value: part, status: FetchStatus.Succeeded})),
    on(fetchPartFail, (state) => ({...state, status: FetchStatus.Failed}))
)