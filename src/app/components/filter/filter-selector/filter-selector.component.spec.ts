import { ComponentFixture, discardPeriodicTasks, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed";
import { HarnessLoader, parallel } from '@angular/cdk/testing';
import { OverlayContainer } from '@angular/cdk/overlay';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatSelectHarness } from '@angular/material/select/testing';

import { FilterSelectorComponent } from './filter-selector.component';
import FilterField from '../types/filterField';
import FilterFieldType from '../types/filterFieldType';
import FilterLine from '../types/filterLine';
import { FilterOperator, namedFilterOperatorsForDatesAndNumbers, nameFilterOperatorsForStrings } from '../types/filterOperators';
import PartCategory from '../../../features/parts/types/PartCategory';
import humanizeString from 'humanize-string';

describe('FilterSelectorComponent', () => {
    let component: FilterSelectorComponent;
    let fixture: ComponentFixture<FilterSelectorComponent>;
    let overlayContainer: OverlayContainer;
    let rootLoader: HarnessLoader;

    const initialFields = [
        { id: 'one-gu', name: 'FieldOne', type: FilterFieldType.StringType, isSelected: true },
        { id: 'two-gu', name: 'FieldTwo', type: FilterFieldType.NumberType, isSelected: true },
        { id: 'three-gu', name: 'FieldThree', type: FilterFieldType.DateType, isSelected: true },
        { id: 'four-gu', name: 'FieldFour', type: FilterFieldType.EnumType, enumType: PartCategory, isSelected: true },
    ] as Array<FilterField>;

    const initialFilterLine = { 
        id: 'five-gu', 
        selectedField: initialFields[0],
        selectedOperator: FilterOperator.Equal.toString(),
        value: ""
    } as FilterLine

    let capturedFilterLineChange: FilterLine | null
    const fakeFilterLineChangedHandler = (filterLine: FilterLine): void | null =>  {
        capturedFilterLineChange = filterLine;
    }

    let capturedRemovedFilterLine: FilterLine | null
    const fakeRemoveFilterHandler = (filterLine: FilterLine): void | null => {
        capturedRemovedFilterLine = filterLine;
    }

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FilterSelectorComponent, BrowserAnimationsModule], 
            providers: [
                provideAnimations()
            ]
        })
        .compileComponents();

        fixture = TestBed.createComponent(FilterSelectorComponent);
        component = fixture.componentInstance;
        component.fields = initialFields;
        component.filterLine = initialFilterLine;
        component.onFilterLineChanged = fakeFilterLineChangedHandler;
        component.onRemoveFilter = fakeRemoveFilterHandler;
        rootLoader = TestbedHarnessEnvironment.documentRootLoader(fixture);
        overlayContainer = TestBed.inject(OverlayContainer);
        fixture.detectChanges();

        capturedFilterLineChange = null;
        capturedRemovedFilterLine = null;
    });

     afterEach(async () => {
        const selects = await rootLoader.getAllHarnesses(MatSelectHarness);
        await Promise.all(selects.map(async (s: MatSelectHarness) => await s.close()));
        overlayContainer.ngOnDestroy();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should be able to select supplied fields', async () => {
        const filterSelectors = await rootLoader.getAllHarnesses(MatSelectHarness);
        expect(filterSelectors.length).toBe(2);
        const fieldSelector = filterSelectors[0];
        await fieldSelector.open();
        const fieldOptions = await fieldSelector.getOptions();
        const fieldOptionTexts = await parallel(() => fieldOptions.map(o => o.getText()));
        expect(fieldOptionTexts).toEqual(initialFields.map(f => humanizeString(f.name)));
        await fieldSelector.close();
    });

    it('should display supplied filter line', async () => {
        const filterSelectors = await rootLoader.getAllHarnesses(MatSelectHarness);
        expect(filterSelectors.length).toBe(2);
        const fieldSelector = filterSelectors[0];
        expect(await fieldSelector.getValueText()).toBe(humanizeString(initialFilterLine.selectedField.name));
        const operatorSelector = filterSelectors[1];
        const expectedOperatorName = nameFilterOperatorsForStrings().find(o => o.filterOperator === initialFilterLine.selectedOperator)?.name ?? '';
        expect(await operatorSelector.getValueText()).toBe(expectedOperatorName);
        const compiled = fixture.nativeElement as HTMLElement;
        const valueInput = compiled.querySelector('input') as HTMLInputElement;
        expect(valueInput.textContent).toBe(initialFilterLine.value);
    });

    it('should display operator selections for string type field', async () => {
        const filterSelectors = await rootLoader.getAllHarnesses(MatSelectHarness);
        const operatorSelector = filterSelectors[1];
        await operatorSelector.open();
        const operatorOptions = await operatorSelector.getOptions();
        const operatorOptionsTexts = await parallel(() => operatorOptions.map(o => o.getText()));
        expect(operatorOptionsTexts).toEqual(nameFilterOperatorsForStrings().map(o => humanizeString(o.name)));
        await operatorSelector.close();
    });

    it('should change operator selections for number type field', async () => {        
        // There is a bug with MatSelectHarness that changes the underlying data bound to the selector setting the id of the first item to whatever the value is of the item clicked
        // This effects the handler's ability to update the operators when the selected field has changed.
        // Using debug element as a work-around to ensure change event fired correctly without affecting underlying values.
        let selectors = fixture.debugElement.queryAll(By.css('mat-select'));
        expect(selectors.length).toBe(2);
        const fieldSelector = selectors[0];
        fieldSelector.triggerEventHandler('selectionChange', {value: initialFields[1].id});
      
        fixture.detectChanges();
               
        const filterSelectors = await rootLoader.getAllHarnesses(MatSelectHarness);
        const operatorSelector = filterSelectors[1];
        await operatorSelector.open();
        const operatorOptions = await operatorSelector.getOptions();
        const operatorOptionsTexts = await parallel(() => operatorOptions.map(o => o.getText()));
        expect(operatorOptionsTexts).toEqual(namedFilterOperatorsForDatesAndNumbers().map(o => humanizeString(o.name)));
        await operatorSelector.close();
    });

    it('should change operator selections for date type field', async () => {
        let selectors = fixture.debugElement.queryAll(By.css('mat-select'));
        expect(selectors.length).toBe(2);
        const fieldSelector = selectors[0];
        fieldSelector.triggerEventHandler('selectionChange', {value: initialFields[2].id});
      
        fixture.detectChanges();
               
        const filterSelectors = await rootLoader.getAllHarnesses(MatSelectHarness);
        const operatorSelector = filterSelectors[1];
        await operatorSelector.open();
        const operatorOptions = await operatorSelector.getOptions();
        const operatorOptionsTexts = await parallel(() => operatorOptions.map(o => o.getText()));
        expect(operatorOptionsTexts).toEqual(namedFilterOperatorsForDatesAndNumbers().map(o => humanizeString(o.name)));
        await operatorSelector.close();
    });

    it('should change operator selections for enum type field', async () => {
        let selectors = fixture.debugElement.queryAll(By.css('mat-select'));
        expect(selectors.length).toBe(2);
        const fieldSelector = selectors[0];
        fieldSelector.triggerEventHandler('selectionChange', {value: initialFields[3].id});
      
        fixture.detectChanges();
               
        const filterSelectors = await rootLoader.getAllHarnesses(MatSelectHarness);
        const operatorSelector = filterSelectors[1];
        await operatorSelector.open();
        const operatorOptions = await operatorSelector.getOptions();
        const operatorOptionsTexts = await parallel(() => operatorOptions.map(o => o.getText()));
        expect(operatorOptionsTexts).toEqual(nameFilterOperatorsForStrings().map(o => humanizeString(o.name)));
        await operatorSelector.close();
    });

    it('should allow enum value options for enum type field', async () => {
        let selectors = fixture.debugElement.queryAll(By.css('mat-select'));
        expect(selectors.length).toBe(2);
        const fieldSelector = selectors[0];
        fieldSelector.triggerEventHandler('selectionChange', {value: initialFields[3].id});
      
        fixture.detectChanges();
       
        const filterSelectors = await rootLoader.getAllHarnesses(MatSelectHarness);
        expect(filterSelectors.length).toBe(3);
        const enumValueSelector = filterSelectors[2];
        await enumValueSelector.open();
        const enumValueOptions = await enumValueSelector.getOptions();
        const enumValueOptionsTexts = await parallel(() => enumValueOptions.map(o => o.getText()));
        expect(enumValueOptionsTexts).toEqual(["Electronic", "Mechanical", "Software", "Miscellaneous"]);
        await enumValueSelector.close();
    });

    it('should handle filter line update with value change', async () => {
        const compiled = fixture.nativeElement as HTMLElement;
        const valueInput = compiled.querySelector('input') as HTMLInputElement;
        expect(valueInput).toBeTruthy();

        valueInput.value = "Test Value";
        valueInput.dispatchEvent(new Event("blur"));
        fixture.detectChanges();

        expect(capturedFilterLineChange?.value).toBe("Test Value");
    });

    it('should handle filter line update with enum value change', async () => {
        let selectors = fixture.debugElement.queryAll(By.css('mat-select'));
        expect(selectors.length).toBe(2);
        const fieldSelector = selectors[0];
        fieldSelector.triggerEventHandler('selectionChange', {value: initialFields[3].id});
        fixture.detectChanges();
       
        selectors = fixture.debugElement.queryAll(By.css('mat-select'));
        expect(selectors.length).toBe(3);
        const enumSelector = selectors[2];
        enumSelector.triggerEventHandler('selectionChange', { value: PartCategory.Miscellaneous});

        expect(capturedFilterLineChange?.value).toBe(PartCategory.Miscellaneous);
    });

    it('should delete filter', async () => {
        const deleteButton = await rootLoader.getHarness(MatButtonHarness.with({ text: "Delete"}));
        expect(deleteButton).toBeTruthy();

        await deleteButton.click();
      
        expect(capturedRemovedFilterLine).toEqual(initialFilterLine);
    });
})


