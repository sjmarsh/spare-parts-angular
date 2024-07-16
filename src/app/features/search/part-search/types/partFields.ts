import FilterField from "../../../../components/filter/types/filterField";
import FilterFieldType from "../../../../components/filter/types/filterFieldType";
import { getUUid } from "../../../../infrastructure/uuidHelper";
import PartCategory from "../../../parts/types/PartCategory";

const partFields = () : Array<FilterField> => {
    return new Array<FilterField>(
        { id: getUUid(), name: "name", type: FilterFieldType.StringType, isSelected: true },
        { id: getUUid(), name: "description", type: FilterFieldType.StringType, isSelected: true },
        { id: getUUid(), name: "category", type: FilterFieldType.EnumType, enumType: PartCategory, isSelected: true },
        { id: getUUid(), name: "weight", type: FilterFieldType.NumberType, isSelected: true },
        { id: getUUid(), name: "price", type: FilterFieldType.NumberType, isSelected: true },
        { id: getUUid(), name: "startDate", type: FilterFieldType.DateType, isSelected: true },
        { id: getUUid(), name: "endDate", type: FilterFieldType.DateType, isSelected: true },
        { id: getUUid(), name: "name", type: FilterFieldType.StringType, isSelected: true, parentFieldName: "attributes" },
        { id: getUUid(), name: "description", type: FilterFieldType.StringType, isSelected: true, parentFieldName: "attributes" },
        { id: getUUid(), name: "value", type: FilterFieldType.StringType, isSelected: true, parentFieldName: "attributes" }
    );
}

export { partFields };