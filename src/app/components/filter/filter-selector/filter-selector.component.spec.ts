import { ComponentFixture, discardPeriodicTasks, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed";
import { HarnessLoader, parallel } from '@angular/cdk/testing';
import { OverlayContainer } from '@angular/cdk/overlay';
import { MatSelectHarness } from '@angular/material/select/testing';

import { FilterSelectorComponent } from './filter-selector.component';
import FilterField from '../types/filterField';
import FilterFieldType from '../types/filterFieldType';
import FilterLine from '../types/filterLine';
import { FilterOperator, namedFilterOperators, namedFilterOperatorsForDatesAndNumbers, nameFilterOperatorsForStrings } from '../types/filterOperators';
import PartCategory from '../../../features/parts/types/PartCategory';
import humanizeString from 'humanize-string';

fdescribe('FilterSelectorComponent', () => {
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
        rootLoader = TestbedHarnessEnvironment.documentRootLoader(fixture);
        overlayContainer = TestBed.inject(OverlayContainer);
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

    fit('should change operator selections for number type field', fakeAsync(() => {
  
        
        // There is a bug with MatSelectHarness that changes the underlying data bound to the selector setting the id of the first item to whatever the value is of the item clicked
        // Using native elements also has the same problem.
        
        let compiled = fixture.nativeElement as HTMLElement;
        const selectorArrows = compiled.querySelectorAll('.mat-mdc-select-arrow');
        expect(selectorArrows.length).toBe(2);
        const fieldSelector = selectorArrows[0] as HTMLDivElement
        fieldSelector.click();
        tick();
        fixture.detectChanges();
        
        let oc = overlayContainer.getContainerElement();       
        const fieldOptions = oc.querySelectorAll('.mat-mdc-option');
        expect(fieldOptions.length).toBe(4);
        const secondFieldOption = (fieldOptions[1] as HTMLElement)
        secondFieldOption.click();
        
        tick();
        fieldSelector.blur();
        tick();
        fixture.detectChanges();
        
        const operatorSelector = selectorArrows[1] as HTMLDivElement
        operatorSelector.click();
        tick();
        fixture.detectChanges();
        const operatorOptions = oc.querySelectorAll('.mat-mdc-option');
        console.log(operatorOptions);
        

        flush();

        expect(1).toBe(2);
/*        
        const filterSelectors = await rootLoader.getAllHarnesses(MatSelectHarness);
        const operatorSelector = filterSelectors[1];
        await operatorSelector.open();
        const operatorOptions = await operatorSelector.getOptions();
        const operatorOptionsTexts = await parallel(() => operatorOptions.map(o => o.getText()));
        expect(operatorOptionsTexts).toEqual(namedFilterOperatorsForDatesAndNumbers().map(o => humanizeString(o.name)));
        await operatorSelector.close();
*/
    }));
})


