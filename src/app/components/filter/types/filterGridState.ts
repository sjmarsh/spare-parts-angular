import FilterField from "./filterField";
import FilterLine from "./filterLine";
import { ReportData } from "./reportData";

interface FilterGridState<T, TD> {
    filterFields: Array<FilterField>;
    filterLines: Array<FilterLine>;
    isFieldsSelectionVisible: boolean;
    isFiltersEntryVisible: boolean;
    filterResults?: ReportData<T, TD> | null;
    currentResultPage: number;
}

export default FilterGridState