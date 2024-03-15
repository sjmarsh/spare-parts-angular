import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideMockStore, MockStore } from '@ngrx/store/testing';

import { PartTableComponent } from './part-table.component';
import { PartDetailState } from '../store/parts.reducers';
import { PartListState } from '../store/partsList.reducers';
import FetchStatus from '../../../constants/fetchStatus';
import Part from '../types/Part';
import PartCategory from '../types/PartCategory';
import DetailMode from '../../../constants/detailMode';
import { deletePart, fetchPart, showDetail } from '../store/parts.actions';


describe('PartTableComponent', () => {
  let component: PartTableComponent;
  let fixture: ComponentFixture<PartTableComponent>;
  let store: MockStore;

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
      imports: [PartTableComponent],
      providers: [provideAnimations(), provideMockStore({ initialState: initialPartDetailState }), provideMockStore({ initialState: initialPartListState })]
    })
    .compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(PartTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
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
  
  
  it('should delete part', () => {
    const dispatchedSpy = spyOn(store, 'dispatch');

    const deleteButton: HTMLButtonElement = fixture.nativeElement.querySelector('button[value=delete]');
    deleteButton.click();
// TODO - currently fails because a confirmation dialog is displayed before delete. Update test to cover this with both scenarios.
    expect(dispatchedSpy).toHaveBeenCalledWith(deletePart({partId: partList[0].id}));
  });
  
  /*
  it('should fetch report', () => {
    expect(true).toBeFalse();
  });
  */
});
