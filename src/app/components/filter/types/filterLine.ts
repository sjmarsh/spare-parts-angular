import FilterField from "./filterField";

interface FilterLine {
    id: string; // guid
    selectedField: FilterField;
    selectedOperator: string;
    value: string;
}

export default FilterLine;