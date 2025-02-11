import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed";
import { HarnessLoader, parallel } from '@angular/cdk/testing';
import { OverlayContainer } from '@angular/cdk/overlay';
import { MatSelectHarness } from '@angular/material/select/testing';

import { FilterSelectorComponent } from './filter-selector.component';
import FilterField from '../types/filterField';
import FilterFieldType from '../types/filterFieldType';
import FilterLine from '../types/filterLine';
import { FilterOperator } from '../types/filterOperators';
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
    })
})