import { Injectable, Inject } from "@angular/core";

import FilterField from "../types/filterField"
import FilterLine from "../types/filterLine"
import FilterFieldType from "../types/filterFieldType";
import GraphQLRequest from "../types/graphQLRequest";
import PageOffset from "../types/pageOffset"
import Environment from "../../../constants/environment";
import { groupByFunc, groupByKey } from "../../../infrastructure/arrayHelper";
import { camelize } from "../../../infrastructure/stringHelper";

const AND_FILTER_PREFIX = " and: {";

@Injectable({
    providedIn: 'root'
  })
export class GraphQLBuilder {
    
    private valueRequiresQuotes = (filterFieldType: FilterFieldType) : boolean => {
        return filterFieldType === FilterFieldType.StringType || filterFieldType == FilterFieldType.DateType;
    }
    
    private getFilterLineValue = (filterLine: FilterLine) : string => {
        if(filterLine.selectedField.type === FilterFieldType.EnumType) {
            return filterLine.value.toUpperCase();
        }
        if(this.valueRequiresQuotes(filterLine.selectedField.type)) {
            let lineValue = filterLine.value;
            if(filterLine.selectedField.type === FilterFieldType.DateType){
                try {
                    lineValue = new Date(lineValue).toISOString();
                }
                catch {
                    // TODO - validate date before it gets here.
                    console.log(`${lineValue} is not a valid Date for use with GraphQL builder.`)
                }  
            }
            return `"${lineValue}"`;
        }
        return filterLine.value;
    }
    
    private getFilterString = (filterLine: FilterLine) : string => {
        const filterLineValue = this.getFilterLineValue(filterLine);
        return ` ${camelize(filterLine.selectedField.name)}: { ${filterLine.selectedOperator}: ${filterLineValue} }`;
    }
    
    private buildQueryFilterComponents = (filterLines: Array<FilterLine>, filter: string, isParent: boolean) => {
        if(!filterLines || filterLines.length === 0){
            return filter;
        }
    
        if(filterLines.length === 1) {
            if(isParent) {
                filter = this.getFilterString(filterLines[0]);
            }
            else {
                filter += this.getFilterString(filterLines[0]);
            }
        }
        else {
            let filterComponent = "";
            filterLines.forEach(filterLine => {
                filterComponent += `${AND_FILTER_PREFIX}${this.getFilterString(filterLine)}`;
            });
            filterComponent = filterComponent.slice(AND_FILTER_PREFIX.length, filterComponent.length);
            filter += filterComponent;
        }
    
        return filter;
    }
    
    private buildQueryFilter = (filterLines: Array<FilterLine>) => {
        let filter = "";    
        if(filterLines && filterLines.length > 0) {
            filter = this.buildQueryFilterComponents(filterLines.filter(f => f.selectedField.parentFieldName === null || f.selectedField.parentFieldName === undefined), filter, true);
            const groupedChildFilterFields = groupByFunc(filterLines.filter(f => f.selectedField.parentFieldName), (filter) => filter.selectedField.parentFieldName ?? "");
            groupedChildFilterFields.forEach(grp => {
                const prefix = filter.length > 0 ? AND_FILTER_PREFIX : "";
                let childFilter = ` ${prefix} ${camelize(grp.key)}: { some: { `;
                childFilter = this.buildQueryFilterComponents(grp.values, childFilter, false);
                childFilter += "}}";
                filter += childFilter;
            });
            
            // build end braces
            for(let i = 0; i < filterLines.length -1; i++) {
                filter += "}";
            }
        }
        return filter;
    }
    
    private buildFilterFields = (filterFields: Array<FilterField>, isParentLevel: boolean) : string => {
        
        let filterFieldString = "";
        if(filterFields && filterFields.length > 0) {
            filterFields.filter(f => f.isSelected && (!(f.parentFieldName && f.parentFieldName.length > 0) === isParentLevel)).forEach(filter => { 
                filterFieldString += filter.name + Environment.NewLine;
            })
        }
        return filterFieldString;
    }
    
    private buildParentLevelFilterFields = (filterFields: Array<FilterField>) : string => {
        return this.buildFilterFields(filterFields, true);
    }
    
    private buildChildLevelFilterFields = (filterFields: Array<FilterField>) : string => {
        let childFilterString = "";
        var groupedChildFilterFields = groupByKey(filterFields.filter(f => f.parentFieldName && f.parentFieldName.length > 0), "parentFieldName");
    
        groupedChildFilterFields.forEach(grp => {
            childFilterString += camelize(grp.key) + Environment.NewLine;
            childFilterString += "{" + Environment.NewLine;
            childFilterString += this.buildFilterFields(grp.values, false) + Environment.NewLine;
            childFilterString += "}" + Environment.NewLine;
        });
    
        return childFilterString;
    }
    
    public build = (filterLines: Array<FilterLine>, filterFields: Array<FilterField>, rootGraphQLField? : string | null, pageOffset?: PageOffset | null) : GraphQLRequest => {
    
        const isPagingEnabled = pageOffset !== null;
        const filter = this.buildQueryFilter(filterLines);
    
        const parentLevelFields = this.buildParentLevelFilterFields(filterFields);
        const childLevelFields = this.buildChildLevelFilterFields(filterFields);
    
        const fields = parentLevelFields + childLevelFields;
    
        const sortOrder = `, order:[{${camelize(filterFields[0].name)}: ASC }]`;
        const filterPageOffset = (pageOffset) ? `, skip: ${pageOffset.skip}, take: ${pageOffset.take}` : "";
        const pagingItemsStart = isPagingEnabled ? "items {" : "";
        const pagingItemsEnd = isPagingEnabled ? `} 
        pageInfo {
            hasNextPage
        }
        totalCount
        ` : "";
    
        return {
            query: `{
                ${rootGraphQLField} (where: { ${filter}}${sortOrder}${filterPageOffset}) {
                    ${pagingItemsStart}
                    ${fields}
                    ${pagingItemsEnd}
                }
            }`
        } as GraphQLRequest
    }    
}
