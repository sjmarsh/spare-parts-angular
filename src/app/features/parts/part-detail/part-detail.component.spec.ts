import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideMockStore, MockStore } from '@ngrx/store/testing';

import { PartDetailComponent } from './part-detail.component';
import { PartDetailState } from '../store/parts.reducers';
import Part from '../types/Part';
import PartAttribute from '../types/PartAttribute';
import DetailMode from '../../../constants/detailMode';
import FetchStatus from '../../../constants/fetchStatus';

describe('PartDetailComponent', () => {
  let component: PartDetailComponent;
  let fixture: ComponentFixture<PartDetailComponent>;
  let store: MockStore;
  
  const initialPart = { 
    id: 1, 
    name: 'Part 1', 
    description: 'The first one', 
    weight: 1.1, 
    price: 10.1, 
    startDate: '2020-11-01', 
    endDate: '2022-12-02', 
    attributes: new Array<PartAttribute> 
  } as Part;
  
  const initialState = {
    parts: { 
      id: 1, 
      value: initialPart,
      mode: DetailMode.Edit, 
      status: FetchStatus.Succeeded 
    } as PartDetailState
  } 

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PartDetailComponent],
      providers: [provideAnimations(), provideMockStore({ initialState })]
    })
    .compileComponents();
    
    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(PartDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display detail mode', () => {
    expect(component.detailMode).toBe(DetailMode.Edit);
    const displayedMode = fixture.nativeElement.querySelector('h2').innerHTML;
    expect(displayedMode).toBe('Edit Part');
  })

  it('should display name', () => {
    expect(component.part.name).toBe(initialPart.name);
    expect(component.partForm?.controls['name'].value).toBe(initialPart.name);
    const nameInputValue = fixture.nativeElement.querySelector('input[formControlName=name]').value;
    expect(nameInputValue).toBe(initialPart.name);
  })

  it('should display description', () => {
    expect(component.part.description).toBe(initialPart.description);
    expect(component.partForm?.controls['description'].value).toBe(initialPart.description);
    const descriptionInputValue = fixture.nativeElement.querySelector('input[formControlName=description]').value;
    expect(descriptionInputValue).toBe(initialPart.description);
  })

  it('should display category', () => {
    expect(component.part.category).toBe(initialPart.category);
    const categoryInput = fixture.nativeElement.querySelector('mat-select[name=category]').querySelector('span').value;
    expect(categoryInput).toBe(initialPart.category);
  })

  it('should display weight', () => {
    expect(component.part.weight).toBe(initialPart.weight);
    const weightInputValue = fixture.nativeElement.querySelector('input[formControlName=weight]').value;
    expect(weightInputValue).toBe(initialPart.weight.toString());
  })

  it('should display price', () => {
    expect(component.part.price).toBe(initialPart.price);
    const priceInputValue = fixture.nativeElement.querySelector('input[formControlName=price]').value;
    expect(priceInputValue).toBe(initialPart.price.toString());
  })

  it('should display start date', () => {
    expect(component.part.startDate).toBe(initialPart.startDate);
    const startDateInputValue = fixture.nativeElement.querySelector('input[formControlName=startDate]').value;
    expect(startDateInputValue).toBe(initialPart.startDate.toString());
  })

  it('should display end date', () => {
    expect(component.part.endDate).toBe(initialPart.endDate);
    const endDateInputValue = fixture.nativeElement.querySelector('input[formControlName=endDate]').value;
    expect(endDateInputValue).toBe(initialPart.endDate?.toString());
  })


});
