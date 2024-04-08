import WithId from "../../../types/withId";
import FilterFieldType from "./filterFieldType";

interface FilterField extends WithId {
    id: string; // guid
    name: string;
    type: FilterFieldType;
    enumType? : object;
    isSelected: boolean;
    parentFieldName?: string | null;
}

export default FilterField;