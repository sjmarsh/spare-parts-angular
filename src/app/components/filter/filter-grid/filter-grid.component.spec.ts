import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed";
import { HarnessLoader, parallel } from '@angular/cdk/testing';
import { MatButtonHarness } from "@angular/material/button/testing";
import { MatInputHarness } from '@angular/material/input/testing';
import { MatSelectHarness } from '@angular/material/select/testing';
import { MatTableHarness } from '@angular/material/table/testing';
import { OverlayContainer } from '@angular/cdk/overlay';

import { FilterGridComponent } from './filter-grid.component';
import FilterGridState from '../types/filterGridState';
import FilterField from '../types/filterField';
import FilterFieldType from '../types/filterFieldType';
import FilterLine from '../types/filterLine';
import GraphQLRequest from '../types/graphQLRequest';
import { DataRow, ReportData } from '../types/reportData';
import { PageInfo } from '../types/pagedData';

interface MasterData {
    id: number;
    name: String;
    quantity: number;
    details: Array<DetailData>
}

interface DetailData {
    id: number;
    description: string;
}


fdescribe('FilterGridComponent', () => {
    let component: FilterGridComponent<MasterData, DetailData>;
    let fixture: ComponentFixture<FilterGridComponent<MasterData, DetailData>>;
    let overlayContainer: OverlayContainer;
    let rootLoader: HarnessLoader;

    const initialFilterFields = [
        { id: 'one-gu', name: 'name', type: FilterFieldType.StringType, isSelected: true }, 
        { id: 'two-gu', name: 'quantity', type: FilterFieldType.NumberType, isSelected: true },
        { id: 'three-gu', name: 'description', parentFieldName: 'details', type: FilterFieldType.StringType, isSelected: true }
    ] as Array<FilterField>;
    
    const initialFilterGridState = {
        filterFields: initialFilterFields,
        filterLines: [
            { id: 'four-gu', selectedField: initialFilterFields[0], selectedOperator: "eq", value: ""}
        ] as Array<FilterLine>
    } as FilterGridState<MasterData, DetailData>;

    let capturedGraphQLRequest: GraphQLRequest | null;
    
    const fakeServiceCall = (graphQLRequest: GraphQLRequest) => {
        capturedGraphQLRequest = graphQLRequest
    }

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FilterGridComponent, BrowserAnimationsModule],
            providers: [
                provideAnimations()
            ]
        })
        .compileComponents();

        fixture = TestBed.createComponent(FilterGridComponent<MasterData, DetailData>);
        component = fixture.componentInstance;
        component.filterGridState = initialFilterGridState;
        component.triggerServiceCall = fakeServiceCall
        capturedGraphQLRequest = null;
        rootLoader = TestbedHarnessEnvironment.documentRootLoader(fixture);
        overlayContainer = TestBed.inject(OverlayContainer)
        fixture.detectChanges();
    });

    afterEach(async () => {
        const selects = await rootLoader.getAllHarnesses(MatSelectHarness);
        await Promise.all(selects.map(async (s: MatSelectHarness) => await s.close()));
        overlayContainer.ngOnDestroy();
    });


    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should display field selection section', () => {
        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.querySelector('Summary')?.textContent).toContain('Fields');
    });

    it('should display filters section', () => {
        const compiled = fixture.nativeElement as HTMLElement;
        const filtersSummary = compiled.querySelectorAll('Summary')[1];
        expect(filtersSummary).toBeTruthy();
        expect(filtersSummary.textContent).toContain('Filters');
    });

    it('should not display results section on init', () => {
        const compiled = fixture.nativeElement as HTMLElement;
        const resultsSummary = compiled.querySelectorAll('Summary')[2];
        expect(resultsSummary).toBeFalsy();
    });

    it('should display fields from state', () => {
        const compiled = fixture.nativeElement as HTMLElement;
        const chips = compiled.querySelectorAll('.chip');
        expect(chips.length).toBe(3);
        // note: chip list component to be tested separately
    });

    it('should handle toggle field', async () => {
        const updateFilterGridStateSpy = spyOn(component, 'updateFilterGridState');
        const compiled = fixture.nativeElement as HTMLElement;
        const chipIcons = compiled.querySelectorAll('.chipIcon');
        const clickedChip = chipIcons[1].firstChild as HTMLElement; // don't click on first one because it is in use by default filter selection

        clickedChip.click();
        
        fixture.whenStable().then(() => { 
            let expectedState = {...initialFilterGridState};
            expectedState.filterFields[1].isSelected = false;
            expect(updateFilterGridStateSpy).toHaveBeenCalledWith(expectedState);
        });
    });

    it('should display filter selectors for state fields', async () => {       
        const addFilterButton = await rootLoader.getHarness(MatButtonHarness.with({text: 'Add Filter'}));
        expect(addFilterButton).toBeTruthy();
        const filterSelectors = await rootLoader.getAllHarnesses(MatSelectHarness);
        expect(filterSelectors.length).toBe(2);
        expect(await filterSelectors[0].getValueText()).toBe('Name');
        // note: filter selector component to be tested separately
    });

    it('should add empty filter', async () => {       
        const addFilterButton = await rootLoader.getHarness(MatButtonHarness.with({text: 'Add Filter'}));
        expect(addFilterButton).toBeTruthy();
        addFilterButton.click();

        const filterSelectors = await rootLoader.getAllHarnesses(MatSelectHarness);
        expect(filterSelectors.length).toBe(4);
    });

    it('should remove filter', async () => {        
        const addFilterButton = await rootLoader.getHarness(MatButtonHarness.with({text: 'Add Filter'}));
        expect(addFilterButton).toBeTruthy();
        addFilterButton.click();

        const deleteFilterButton = await rootLoader.getHarness(MatButtonHarness.with({text: 'Delete'}));
        expect(deleteFilterButton).toBeTruthy();
        deleteFilterButton.click();

        const filterSelectors = await rootLoader.getAllHarnesses(MatSelectHarness);
        expect(filterSelectors.length).toBe(2);
    });

   it('should handle change to filter line', async () => {
        const updateFilterGridStateSpy = spyOn(component, 'updateFilterGridState');
        
        // change filter to 2nd option
        const filterSelectors = await rootLoader.getAllHarnesses(MatSelectHarness);
        await filterSelectors[0].open();        
        const fieldOptions = await filterSelectors[0].getOptions();
        await fieldOptions[1].click();
        await filterSelectors[0].close();

        fixture.detectChanges();
       
        fixture.whenStable().then(() => { 
            let expectedState = {...initialFilterGridState};
            expectedState.filterLines[0].selectedField.id = initialFilterFields[1].id;  // NOTE: seems to be a bug with MatSelectHarness option click only changing the underlying value (in this case ID) and not the display value.
            expect(updateFilterGridStateSpy).toHaveBeenCalledWith(expectedState);
         });
    });

    it('should search', async () => {
        const filterSelectors = await rootLoader.getAllHarnesses(MatSelectHarness);
        await filterSelectors[0].open();        
        const fieldOptions = await filterSelectors[0].getOptions();
        await fieldOptions[0].click();
        await filterSelectors[0].close();

        const filterValue = 'TEST'
        const filterValueInput = await rootLoader.getHarness(MatInputHarness);
        await filterValueInput.setValue(filterValue);
        await filterValueInput.blur();

        const searchButton = await rootLoader.getHarness(MatButtonHarness.with({text: 'Search'}));
        expect( await searchButton.isDisabled()).toBeFalse();  // make sure filter selections are valid and button is enabled
        searchButton.click();

        fixture.detectChanges();

        fixture.whenStable().then(() => {  
            expect(capturedGraphQLRequest).toBeTruthy();
            expect(capturedGraphQLRequest?.query).toContain(filterValue);
        });
    });

    it('should not search when invalid or no filter set', async () => { 
        const searchButton = await rootLoader.getHarness(MatButtonHarness.with({text: 'Search'}));
        expect( await searchButton.isDisabled()).toBeTrue(); 
    });

    it('should display results from state', async () => {
        const compiled = fixture.nativeElement as HTMLElement;
        const stateWithResults = {...initialFilterGridState};
        const testDetails = [
            { id: 1, description: "Description1" }
        ] as Array<DetailData>
        stateWithResults.filterResults = {
            items: [
                { id: 'r1-gu', item: { id: 1, name: "Data1", quantity: 1, details: testDetails } as MasterData, details: testDetails, isDetailsVisible: false },
                { id: 'r2-gu', item: { id: 2, name: "Data2", quantity: 2, details: [] } as MasterData, details: [] as Array<DetailData>, isDetailsVisible: false }
            ] as Array<DataRow<MasterData,DetailData>>,
            pageInfo: { hasNextPage: false } as PageInfo,
            totalCount: 2
         } as ReportData<MasterData, DetailData>
        component.filterGridState = stateWithResults;
        fixture.detectChanges();
        
        const resultsSummary = compiled.querySelectorAll('Summary')[2];
        expect(resultsSummary).toBeTruthy();
        expect(resultsSummary.textContent).toContain('Results');

        const resultsTable = await rootLoader.getHarness(MatTableHarness);
        
        const headerRows = await resultsTable.getHeaderRows();
        expect(headerRows.length).toEqual(1);
        const headerCells = await headerRows[0].getCells();
        const headerCellTexts = await parallel(() => headerCells.map(cell => cell.getText()));
        expect(headerCellTexts).toEqual(['Name', 'Quantity', 'Details']);

         const dataRows = await resultsTable.getRows();
         expect(dataRows.length).toEqual(4); //includes details row placeholders
         const row1Cells = await dataRows[0].getCells();
         const row1CellTexts =  await parallel(() => row1Cells.map(cell => cell.getText()));
         expect(row1CellTexts).toEqual(['Data1', '1', 'unfold_more']);

         const row2Cells = await dataRows[2].getCells();
         const row2CellTexts =  await parallel(() => row2Cells.map(cell => cell.getText()));
         expect(row2CellTexts).toEqual(['Data2', '2', '']);
    });

    it('should show result details', async () => {
        const stateWithResults = {...initialFilterGridState};
        const testDetails = [
            { id: 1, description: "Description1" }
        ] as Array<DetailData>
        stateWithResults.filterResults = {
            items: [
                { id: 'r1-gu', item: { id: 1, name: "Data1", quantity: 1, details: testDetails } as MasterData, details: testDetails, isDetailsVisible: true }, // note detail visible is true
                { id: 'r2-gu', item: { id: 2, name: "Data2", quantity: 2, details: [] } as MasterData, details: [] as Array<DetailData>, isDetailsVisible: false }
            ] as Array<DataRow<MasterData,DetailData>>,
            pageInfo: { hasNextPage: false } as PageInfo,
            totalCount: 2
         } as ReportData<MasterData, DetailData>
        component.filterGridState = stateWithResults;
        fixture.detectChanges();
        
        const allTables = await rootLoader.getAllHarnesses(MatTableHarness);
        expect(allTables.length).toBe(2);
        const resultsTable = allTables[1];
        const dataRows = await resultsTable.getRows();
        expect(dataRows.length).toEqual(1); 
        const detailRow1Cells = await dataRows[0].getCells();
        const detailRow1CellTexts =  await parallel(() => detailRow1Cells.map(cell => cell.getText()));
        console.log(detailRow1CellTexts);
        expect(detailRow1CellTexts).toEqual(['Description1']);
    });

    it('should toggle detail visibility', async () => {
        const toggleDetailSpy = spyOn(component, 'toggleDetail');
        const stateWithResults = {...initialFilterGridState};
        const testDetails = [
            { id: 1, description: "Description1" }
        ] as Array<DetailData>
        stateWithResults.filterResults = {
            items: [
                { id: 'r1-gu', item: { id: 1, name: "Data1", quantity: 1, details: testDetails } as MasterData, details: testDetails, isDetailsVisible: false }, 
                { id: 'r2-gu', item: { id: 2, name: "Data2", quantity: 2, details: [] } as MasterData, details: [] as Array<DetailData>, isDetailsVisible: false }
            ] as Array<DataRow<MasterData,DetailData>>,
            pageInfo: { hasNextPage: false } as PageInfo,
            totalCount: 2
         } as ReportData<MasterData, DetailData>
        component.filterGridState = stateWithResults;
        fixture.detectChanges();
               
        const showMoreButton = await rootLoader.getHarness(MatButtonHarness.with({text: 'unfold_more'}));
        expect(showMoreButton).toBeTruthy();
        await showMoreButton.click();

        const expectedRow = stateWithResults.filterResults.items[0];
        expect(toggleDetailSpy).toHaveBeenCalledWith(expectedRow);
    });
 
})




