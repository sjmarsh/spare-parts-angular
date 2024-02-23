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
  const initialState = {
    parts: { 
      id: 1, 
      value: { id: 1, name: 'Part 1', description: 'The first one', weight: 1.1, price: 10.1, startDate: '2020-11-01', endDate: '2022-12-02', attributes: new Array<PartAttribute> } as Part, 
      mode: DetailMode.Edit, 
      status: FetchStatus.Idle 
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
    component.ngOnInit();
    expect(component.detailMode).toBe(DetailMode.Edit);
    const displayedMode = fixture.nativeElement.querySelector('h2').innerHTML;
    expect(displayedMode).toBe('Edit Part');
  })

  it('should display name', () => {
    component.ngOnInit();
    expect(component.part.name).toBe('Part 1');
  })

});
