import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { OverlayContainer } from '@angular/cdk/overlay';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatSelectHarness } from '@angular/material/select/testing';
import { MatInputHarness } from '@angular/material/input/testing';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideMockStore, MockStore } from '@ngrx/store/testing';

import { ManualStockEntryComponent } from './manual-stock-entry.component';
import { InventoryState } from '../store/inventory.reducers';
import Part from '../../parts/types/Part';
import FetchStatus from '../../../constants/fetchStatus';

describe('ManualStockEntryComponent', () => {
    let component: ManualStockEntryComponent;
    let fixture: ComponentFixture<ManualStockEntryComponent>;
    let store: MockStore;
    let loader: HarnessLoader;
    let overlayContainer: OverlayContainer;

    const currentParts = [ 
      { id: 1, name: 'Part1', description: 'The first one', weight: 1.1, price: 1.11, startDate: '2001-01-01' } as Part,
      { id: 2, name: 'Part2', description: 'The second one', weight: 2.2, price: 2.22, startDate: '2002-02-02' } as Part 
    ]

    const initialState = {
        inventory: { 
            currentParts: currentParts, 
            status: FetchStatus.Succeeded
        } as InventoryState
    }

    beforeEach(async () => {
        await TestBed.configureTestingModule({
          imports: [ManualStockEntryComponent],
          providers: [provideAnimations(), provideMockStore({ initialState })]
        })
        .compileComponents();
        
        store = TestBed.inject(MockStore);
        fixture = TestBed.createComponent(ManualStockEntryComponent);
        component = fixture.componentInstance;
        loader = TestbedHarnessEnvironment.loader(fixture);
        overlayContainer = TestBed.inject(OverlayContainer)
        fixture.detectChanges();
      });
    
      afterEach(async () => {
        const selects = await loader.getAllHarnesses(MatSelectHarness);
        await Promise.all(selects.map(async (s: MatSelectHarness) => await s.close()));
        
        overlayContainer.ngOnDestroy();
      });

      it('should create', () => {
        expect(component).toBeTruthy();
      });
    
      // ref: https://material.angular.io/guide/using-component-harnesses
      // https://material.angular.io/components/select/api
      it('should have current part selections', async () => {
        expect(component.currentParts).toEqual(currentParts);
        const partSelect = await loader.getHarness(MatSelectHarness);
        await partSelect.open();
        const partOptions = await partSelect.getOptions();
        expect(partOptions.length).toBe(2);
        const options = await Promise.all(partOptions.map(async o => o.getText()));
        expect(options).toEqual(['Part1', 'Part2']);
      });

      it('should submit entry', async () => {
        const dispatchedSpy = spyOn(store, 'dispatch');
        const partSelect = await loader.getHarness(MatSelectHarness);
        await partSelect.open();
        await partSelect.clickOptions({text: 'Part2'});
        const quantityInput = await loader.getHarness(MatInputHarness);
        await quantityInput.setValue('2');

        const submitButton: HTMLButtonElement = fixture.nativeElement.querySelector('button[type=submit]');
        submitButton.click();

        fixture.detectChanges();

        fixture.whenStable().then(() => {  
          expect(dispatchedSpy).toHaveBeenCalledWith(jasmine.objectContaining({
            item: jasmine.objectContaining({
              id: 0,
              partID: 2,
              partName: '',
              quantity: 2  // ignore dateAdded (TODO - inject date helper as service so it can be substituted in test)
            })
          }));
        });

      });
});  