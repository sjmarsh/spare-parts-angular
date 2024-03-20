import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { OverlayContainer } from '@angular/cdk/overlay';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatInputHarness } from '@angular/material/input/testing';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideMockStore, MockStore } from '@ngrx/store/testing';

import { StocktakeComponent } from './stocktake.component';
import { InventoryState } from '../store/inventory.reducers';
import FetchStatus from '../../../constants/fetchStatus';
import InventoryItem from '../types/InventoryItem';
import { DateTimeHelper } from '../../../infrastructure/dateTime';
import { createInventoryItemList } from '../store/inventory.actions';

describe('StocktakeComponent', () => {
    let component: StocktakeComponent;
    let fixture: ComponentFixture<StocktakeComponent>;
    let store: MockStore;
    let loader: HarnessLoader;
    let overlayContainer: OverlayContainer;
    let dateTimeSpy: jasmine.SpyObj<DateTimeHelper>;

    const inventoryItems = [
        { id: 31, partID: 1, partName: 'Part1', quantity: 0 } as InventoryItem,
        { id: 32, partID: 2, partName: 'Part2', quantity: 0 } as InventoryItem
    ]

    const initialState = {
        inventory: { 
            items: inventoryItems,
            status: FetchStatus.Succeeded
        } as InventoryState
    }

    const dateRecordedStubValue = '2000-02-02';

    beforeEach(async () => {
        const dateSpy = jasmine.createSpyObj('DateTimeHelper', ['getLocalDateTimeString'])
        await TestBed.configureTestingModule({
          imports: [StocktakeComponent],
          providers: [provideAnimations(), provideMockStore({ initialState }), { provide: DateTimeHelper, useValue: dateSpy}]
        })
        .compileComponents();
        
        store = TestBed.inject(MockStore);
        dateTimeSpy = TestBed.inject(DateTimeHelper) as jasmine.SpyObj<DateTimeHelper>;
        dateTimeSpy.getLocalDateTimeString.and.returnValue(dateRecordedStubValue);
        fixture = TestBed.createComponent(StocktakeComponent);
        component = fixture.componentInstance;
        loader = TestbedHarnessEnvironment.loader(fixture);
        overlayContainer = TestBed.inject(OverlayContainer)
        fixture.detectChanges();
      });
    
      afterEach(async () => {  
        overlayContainer.ngOnDestroy();
      });

      it('should create', () => {
        expect(component).toBeTruthy();
      });

      it('should display items for stocktake', () => {
        const rows = fixture.nativeElement.querySelectorAll('tr');
        expect(rows.length).toBe(3); // first row is header row
        const part1Label = rows[1].querySelectorAll('td')[0].innerText;
        expect(part1Label).toBe(inventoryItems[0].partName);
      });

      it('should create stocktake entries', async () => {
        const dispatchedSpy = spyOn(store, 'dispatch');
        const quantityInputs = await loader.getAllHarnesses(MatInputHarness);
        expect(quantityInputs.length).toBe(2);
        await quantityInputs[0].setValue('11');
        await quantityInputs[1].setValue('22');

        const submitButton: HTMLButtonElement = fixture.nativeElement.querySelector('button[type=submit]');
        submitButton.click();

        fixture.detectChanges();
        fixture.whenStable().then(() => {  
            expect(dispatchedSpy).toHaveBeenCalledWith(createInventoryItemList({items: [{
                    id: 0,
                    partID: 1,
                    partName: 'Part1',
                    quantity: 11,
                    dateRecorded: dateRecordedStubValue 
                },
                {
                    id: 0,
                    partID: 2,
                    partName: 'Part2',
                    quantity: 22,
                    dateRecorded: dateRecordedStubValue 
                }]
            }));           
        });

      })

})