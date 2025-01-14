import { PageInfo } from "./pagedData";

interface DataRow<T, TD> {
    item: T;
    details?: Array<TD>
}

interface ReportData<T, TD> {
    items: Array<DataRow<T, TD>>;
    pageInfo: PageInfo;
    totalCount: number;
    error?: string | null;
}

export { DataRow, ReportData }