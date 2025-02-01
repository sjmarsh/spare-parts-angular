import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed";
import { HarnessLoader } from '@angular/cdk/testing';
import { MatButtonHarness } from "@angular/material/button/testing";

import { FilterGridComponent } from './filter-grid.component';
import FilterGridState from '../types/filterGridState';
import FilterField from '../types/filterField';
import FilterFieldType from '../types/filterFieldType';
import { MatSelectHarness } from '@angular/material/select/testing';
import FilterLine from '../types/filterLine';

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
        fixture.detectChanges();

        rootLoader = TestbedHarnessEnvironment.documentRootLoader(fixture);
    });


    it('should create', () => {
        expect(component).toBeTruthy();
    })

    it('should display field selection section', () => {
        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.querySelector('Summary')?.textContent).toContain('Fields');
    })

    it('should display filters section', () => {
        const compiled = fixture.nativeElement as HTMLElement;
        const filtersSummary = compiled.querySelectorAll('Summary')[1];
        expect(filtersSummary).toBeTruthy();
        expect(filtersSummary.textContent).toContain('Filters');
    })

    it('should not display results section on init', () => {
        const compiled = fixture.nativeElement as HTMLElement;
        const filtersSummary = compiled.querySelectorAll('Summary')[2];
        expect(filtersSummary).toBeFalsy();
    })

    it('should display fields from state', () => {
        const compiled = fixture.nativeElement as HTMLElement;
        const chips = compiled.querySelectorAll('.chip');
        expect(chips.length).toBe(3);
        // note: chip list component to be tested separately
    });

    it('should display filter selectors for state fields', async () => {
        const compiled = fixture.nativeElement as HTMLElement;
        
        const addFilterButton = await rootLoader.getHarness(MatButtonHarness.with({text: 'Add Filter'}));
        expect(addFilterButton).toBeTruthy();
        const filterSelectors = await rootLoader.getAllHarnesses(MatSelectHarness);
        expect(filterSelectors.length).toBe(2);
        expect(await filterSelectors[0].getValueText()).toBe('Name');
        // note: filter selector component to be tested separately
    })

})