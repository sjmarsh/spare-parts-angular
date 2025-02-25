import { GraphQLBuilder } from './graphQLRequestBuilder';
import { getUUid } from "../../../infrastructure/uuidHelper";
import FilterField from "../types/filterField";
import FilterFieldType from "../types/filterFieldType";
import FilterLine from "../types/filterLine";
import { FilterOperator, NamedFilterOperator } from "../types/filterOperators";
import PageOffset from '../types/pageOffset';


describe('graphQLRequestBuilder', () => {
    
    it('should build graphQL request', () => {

        const theFields = new Array<FilterField>(
            { id: getUUid(), name: "field1", type: FilterFieldType.StringType, isSelected: true } as FilterField,
            { id: getUUid(), name: "field2", type: FilterFieldType.NumberType, isSelected: true } as FilterField,
            { id: getUUid(), name: "field3", type: FilterFieldType.DateType, isSelected: true } as FilterField
        );

        const theOperators = new Array<NamedFilterOperator>(
            { name: "Equals", filterOperator: FilterOperator.Equal } as NamedFilterOperator,
            { name: "Contains", filterOperator: FilterOperator.Contains } as NamedFilterOperator
        );

        const theValue = "The Value";

        const filterLine1 = { selectedField: theFields[0], selectedOperator: theOperators[0].filterOperator, value: theValue } as FilterLine
        const theFilterLines = new Array<FilterLine>(
            filterLine1
        );

        const rootGraphQLField = "Things";
        const graphQLBuilder = new GraphQLBuilder();
        var result = graphQLBuilder.build(theFilterLines, theFields, rootGraphQLField);
        
        expect(result.query.length).toBeGreaterThan(0);
        expect(result.query).toContain(`${rootGraphQLField} (where: {  field1: { eq: \"${theValue}\" }}`);
        expect(result.query).toContain("field1\r\nfield2\r\nfield3");       
    });

    it('should build graphQL request with more than one filter', () => {

        const theFields = new Array<FilterField>(
            { id: getUUid(), name: "field1", type: FilterFieldType.StringType, isSelected: true } as FilterField,
            { id: getUUid(), name: "field2", type: FilterFieldType.NumberType, isSelected: true } as FilterField,
            { id: getUUid(), name: "field3", type: FilterFieldType.DateType, isSelected: true } as FilterField
        );

        const theOperators = new Array<NamedFilterOperator>(
            { name: "Equals", filterOperator: FilterOperator.Equal } as NamedFilterOperator,
            { name: "Contains", filterOperator: FilterOperator.Contains } as NamedFilterOperator
        );

        const theValue = "The Value";
        const theOtherValue = "3";

        const filterLine1 = { selectedField: theFields[0], selectedOperator: theOperators[0].filterOperator, value: theValue } as FilterLine
        const filterLine2 = { selectedField: theFields[1], selectedOperator: theOperators[1].filterOperator, value: theOtherValue } as FilterLine
        const theFilterLines = new Array<FilterLine>(
            filterLine1,
            filterLine2
        );

        const rootGraphQLField = "Things";

        const graphQLBuilder = new GraphQLBuilder();
        var result = graphQLBuilder.build(theFilterLines, theFields, rootGraphQLField);

        expect(result.query.length).toBeGreaterThan(0);
        expect(result.query).toContain(`${rootGraphQLField} (where: {  field1: { eq: \"${theValue}\" `);
        expect(result.query).toContain("and: { field2: { contains: 3");
        expect(result.query).toContain("field1\r\nfield2\r\nfield3");       
    });

    it('should build graphQL request for selected fields', () => {

        const theFields = new Array<FilterField>(
            { id: getUUid(), name: "field1", type: FilterFieldType.StringType, isSelected: true } as FilterField,
            { id: getUUid(), name: "field2", type: FilterFieldType.NumberType, isSelected: false } as FilterField, // not selected
            { id: getUUid(), name: "field3", type: FilterFieldType.DateType, isSelected: false } as FilterField // not selected
        );

        const theOperators = new Array<NamedFilterOperator>(
            { name: "Equals", filterOperator: FilterOperator.Equal } as NamedFilterOperator,
            { name: "Contains", filterOperator: FilterOperator.Contains } as NamedFilterOperator
        );

        const theValue = "The Value";

        const filterLine1 = { selectedField: theFields[0], selectedOperator: theOperators[0].filterOperator, value: theValue } as FilterLine
        const theFilterLines = new Array<FilterLine>(
            filterLine1
        );

        const rootGraphQLField = "Things";
        const graphQLBuilder = new GraphQLBuilder();
        var result = graphQLBuilder.build(theFilterLines, theFields, rootGraphQLField);
        
        expect(result.query.length).toBeGreaterThan(0);
        expect(result.query).toContain(`${rootGraphQLField} (where: {  field1: { eq: \"${theValue}\" }}`);
        expect(result.query).toContain("field1\r\n");
        expect(result.query).not.toContain("field2");
        expect(result.query).not.toContain("field3");
    });

    it('should build graphQL request with correct date format', () => {

        const theFields = new Array<FilterField>(
            { id: getUUid(), name: "field1", type: FilterFieldType.StringType, isSelected: true } as FilterField,
            { id: getUUid(), name: "field2", type: FilterFieldType.NumberType, isSelected: true } as FilterField, 
            { id: getUUid(), name: "field3", type: FilterFieldType.DateType, isSelected: true } as FilterField 
        );

        const theOperators = new Array<NamedFilterOperator>(
            { name: "Equals", filterOperator: FilterOperator.Equal } as NamedFilterOperator,
            { name: "GraterThan", filterOperator: FilterOperator.GreaterThan } as NamedFilterOperator
        );

        const theValue = "2010-01-01";

        const filterLine1 = { selectedField: theFields[2], selectedOperator: theOperators[1].filterOperator, value: theValue } as FilterLine
        const theFilterLines = new Array<FilterLine>(
            filterLine1
        );

        const rootGraphQLField = "Things";
        const graphQLBuilder = new GraphQLBuilder();
        var result = graphQLBuilder.build(theFilterLines, theFields, rootGraphQLField);
        
        expect(result.query.length).toBeGreaterThan(0);
        expect(result.query).toContain(`${rootGraphQLField} (where: {  field3: { gt: \"2010-01-01T00:00:00.000Z\" }}`);
        expect(result.query).toContain("field3\r\n");
    });

    it('should build graphQL request with page offset', () => {

        const theFields = new Array<FilterField>(
            { id: getUUid(), name: "field1", type: FilterFieldType.StringType, isSelected: true } as FilterField,
            { id: getUUid(), name: "field2", type: FilterFieldType.NumberType, isSelected: true } as FilterField,
            { id: getUUid(), name: "field3", type: FilterFieldType.DateType, isSelected: true } as FilterField
        );

        const theOperators = new Array<NamedFilterOperator>(
            { name: "Equals", filterOperator: FilterOperator.Equal } as NamedFilterOperator,
            { name: "Contains", filterOperator: FilterOperator.Contains } as NamedFilterOperator
        );

        const theValue = "The Value";

        const filterLine1 = { selectedField: theFields[0], selectedOperator: theOperators[0].filterOperator, value: theValue } as FilterLine
        const theFilterLines = new Array<FilterLine>(
            filterLine1
        );

        const rootGraphQLField = "Things";

        const pageOffset = { skip: 1, take: 5 } as PageOffset

        const graphQLBuilder = new GraphQLBuilder();
        var result = graphQLBuilder.build(theFilterLines, theFields, rootGraphQLField, pageOffset);
       
        expect(result.query.length).toBeGreaterThan(0);
        expect(result.query).toContain(`${rootGraphQLField} (where: {  field1: { eq: \"${theValue}\" }}`);
        expect(result.query).toContain(`, skip: ${pageOffset.skip}, take: ${pageOffset.take}`);
    });

});