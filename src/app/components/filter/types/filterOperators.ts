enum FilterOperator {
    Equal = "eq",
    NotEqual = "neq",
    Contains = "contains",
    GreaterThan = "gt",
    GreatherThanOrEqual = "gte",
    LessThan = "lt",
    LessThanOrEqual = "lte",
    StartsWith = "startsWith",
    EndsWith = "endsWith",
}

interface NamedFilterOperator {
    name: string;
    filterOperator: string;
}

const namedFilterOperators = () : Array<NamedFilterOperator> => {
    var operators = Object.entries(FilterOperator);
    return operators.map((op) => { return { name: op[0], filterOperator: op[1] } as NamedFilterOperator });
}

const namedFilterOperatorsForDatesAndNumbers = () : Array<NamedFilterOperator> => {
    const numberOperators = new Array<string>(FilterOperator.Equal, FilterOperator.NotEqual, FilterOperator.GreaterThan, FilterOperator.GreatherThanOrEqual, FilterOperator.LessThan, FilterOperator.LessThanOrEqual);
    return namedFilterOperators().filter(f => numberOperators.includes(f.filterOperator));
}

const nameFilterOperatorsForStrings = () : Array<NamedFilterOperator> => {
    const stringOperators = new Array<string>(FilterOperator.Equal, FilterOperator.NotEqual, FilterOperator.Contains, FilterOperator.StartsWith, FilterOperator.EndsWith);
    return namedFilterOperators().filter(f => stringOperators.includes(f.filterOperator));
}

export {
    FilterOperator,
    NamedFilterOperator,
    namedFilterOperators,
    namedFilterOperatorsForDatesAndNumbers,
    nameFilterOperatorsForStrings
}