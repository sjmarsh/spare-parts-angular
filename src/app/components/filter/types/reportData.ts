import { getUUid } from "../../../infrastructure/uuidHelper";
import WithId from "../../../types/withId";
import { PageInfo } from "./pagedData";

class DataRow<T, TD> implements WithId {   
    id: any;
    item: T;
    details?: Array<TD>;
    isDetailsVisible: boolean;

    constructor(){
        this.id = getUUid();
        this.item = {} as T;
        this.isDetailsVisible = false;
    }
}

interface ReportData<T, TD> {
    items: Array<DataRow<T, TD>>;
    pageInfo: PageInfo;
    totalCount: number;
    error?: string | null;
}

export { DataRow, ReportData }