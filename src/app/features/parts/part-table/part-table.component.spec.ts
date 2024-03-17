import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed";
import { HarnessLoader } from '@angular/cdk/testing';
import { OverlayContainer } from '@angular/cdk/overlay';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDialogHarness } from '@angular/material/dialog/testing';
import { MatButtonHarness } from "@angular/material/button/testing";
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { provideMockStore, MockStore } from '@ngrx/store/testing';

import { PartTableComponent } from './part-table.component';
import { MessageBoxComponent } from '../../../components/message-box/message-box.component';
import { PartDetailState } from '../store/parts.reducers';
import { PartListState } from '../store/partsList.reducers';
import FetchStatus from '../../../constants/fetchStatus';
import Part from '../types/Part';
import PartCategory from '../types/PartCategory';
import DetailMode from '../../../constants/detailMode';
import { deletePart, fetchPart, showDetail } from '../store/parts.actions';
import { fetchReport } from '../store/partsReport.actions';


describe('PartTableComponent', () => {
  let component: PartTableComponent;
  let fixture: ComponentFixture<PartTableComponent>;
  let store: MockStore;
  let rootLoader: HarnessLoader;
  let overlayContainer: OverlayContainer;

  const partList = [
    { id: 1, name: "Part1", description: "The first one", category: PartCategory.Mechanical, weight: 1.1, price: 1.11, startDate: '2010-01-11' } as Part,
    { id: 2, name: "Part2", description: "The second one", category: PartCategory.Software, weight: 2.2, price: 2.22, startDate: '2020-02-22', endDate: "2022-03-03" } as Part,
  ]

  const initialPartListState = {
    partList: {
      items: partList,
      totalItemCount: 2,
      currentPage: 0,
      status: FetchStatus.Succeeded, 
      hasError: false, 
      error: ""
    } as PartListState
  } 

  const initialPartDetailState =
  {
    parts: {
      id: 1,
      value: partList[0],
      mode: DetailMode.Closed,
      status: FetchStatus.Succeeded,
      error: ""
    } as PartDetailState
  } 

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PartTableComponent, BrowserAnimationsModule, MatDialogModule, MessageBoxComponent],
      providers: [
        provideAnimations(), 
        provideMockStore({ initialState: initialPartDetailState }),
        provideMockStore({ initialState: initialPartListState })
      ]
    })
    .compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(PartTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    rootLoader = TestbedHarnessEnvironment.documentRootLoader(fixture);
    overlayContainer = TestBed.inject(OverlayContainer)
  });

  afterEach(async () => {
    const dialogs = await rootLoader.getAllHarnesses(MatDialogHarness);

    await Promise.all(dialogs.map(async (d: MatDialogHarness) => await d.close()));
    overlayContainer.ngOnDestroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('should display list', () => {
    expect(component.currentPage).toBe(0);
    expect(component.pageOfParts).toEqual(partList);
    expect(component.totalItemCount).toBe(initialPartListState.partList.totalItemCount);
    const rows = fixture.nativeElement.querySelectorAll('tr');
    expect(rows.length).toBe(3); // first row is header row
    const row1 = rows[1];
    const cells = row1.querySelectorAll('td');
    expect(cells.length).toBe(9);
    expect(cells[0].innerText).toBe(partList[0].name);
    expect(cells[1].innerText).toBe(partList[0].description);
    expect(cells[2].innerText).toBe(partList[0].category);
    expect(cells[3].innerText).toBe(partList[0].weight.toString());
    expect(cells[4].innerText).toBe(partList[0].price.toString());
    expect(cells[5].innerText).toBe("11/01/2010");
    expect(cells[6].innerText).toBe('');
  });
  
  it('should display empty list', () => {
    store.setState({partList: {
      items: [],
      totalItemCount: 0,
      currentPage: 0,
      status: FetchStatus.Succeeded, 
      hasError: false, 
      error: ""
    } as PartListState});
    fixture.detectChanges();
    expect(component.currentPage).toBe(0);
    expect(component.pageOfParts).toEqual([]);
    expect(component.totalItemCount).toBe(0);
    const rows = fixture.nativeElement.querySelectorAll('tr');
    expect(rows.length).toBe(1); // first row is header row
  });
     
  it('should add part', () => {
    const dispatchedSpy = spyOn(store, 'dispatch');

    const addButton: HTMLButtonElement = fixture.nativeElement.querySelector('button[value=add]');
    addButton.click();

    expect(dispatchedSpy).toHaveBeenCalledWith(showDetail({mode: DetailMode.Add}));
  });
    
  it('should edit part', () => {
    const dispatchedSpy = spyOn(store, 'dispatch');

    const editButton: HTMLButtonElement = fixture.nativeElement.querySelector('button[value=edit]');
    editButton.click();

    expect(dispatchedSpy).toHaveBeenCalledWith(fetchPart({partId: partList[0].id}));
  });
    
  it('should delete part', async () => {
    const dispatchedSpy = spyOn(store, 'dispatch');

    const deleteButton: HTMLButtonElement = fixture.nativeElement.querySelector('button[value=delete]');
    deleteButton.click();
    
    // confirm deletion in dialog
    let dialogs = await rootLoader.getAllHarnesses(MatDialogHarness);
    expect(dialogs.length).toEqual(1);
    const yesButton = await rootLoader.getHarness(
      MatButtonHarness.with({selector: "button[value=yes]"})
    );
    expect(yesButton).toBeTruthy();
    await yesButton.click();
      
    expect(dispatchedSpy).toHaveBeenCalledWith(deletePart({partId: partList[0].id}));  
  });

  it('should cancel delete part', async () => {
    const dispatchedSpy = spyOn(store, 'dispatch');

    const deleteButton: HTMLButtonElement = fixture.nativeElement.querySelector('button[value=delete]');
    deleteButton.click();
    
    // reject deletion in dialog
    let dialogs = await rootLoader.getAllHarnesses(MatDialogHarness);
    expect(dialogs.length).toEqual(1);
    const noButton = await rootLoader.getHarness(
      MatButtonHarness.with({selector: "button[value=no]"})
    );
    expect(noButton).toBeTruthy();
    await noButton.click();
      
    expect(dispatchedSpy).not.toHaveBeenCalledWith(deletePart({partId: partList[0].id})); 
  })
    
  it('should fetch report', () => {
    const dispatchedSpy = spyOn(store, 'dispatch');

    const reportButton: HTMLButtonElement = fixture.nativeElement.querySelector('button[value=report]');
    reportButton.click();

    expect(dispatchedSpy).toHaveBeenCalledWith(fetchReport());
  });
  
});
