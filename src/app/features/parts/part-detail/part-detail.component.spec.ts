import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideMockStore, MockStore } from '@ngrx/store/testing';

import { PartDetailComponent } from './part-detail.component';
import { PartDetailState } from '../store/parts.reducers';
import { updatePart, hideDetail } from '../store/parts.actions';
import Part from '../types/Part';
import PartAttribute from '../types/PartAttribute';
import DetailMode from '../../../constants/detailMode';
import FetchStatus from '../../../constants/fetchStatus';
import PartCategory from '../types/PartCategory';

describe('PartDetailComponent', () => {
  let component: PartDetailComponent;
  let fixture: ComponentFixture<PartDetailComponent>;
  let store: MockStore;
    
  const initialAttributes = new Array<PartAttribute>(
    { name: 'Attribute1', description: 'The first attribute', value: 'Its a part attribute' } as PartAttribute
  )

  const initialPart = { 
    id: 1, 
    name: 'Part 1', 
    description: 'The first one', 
    category: PartCategory.Software,
    weight: 1.1, 
    price: 10.1, 
    startDate: '2020-11-01', 
    endDate: '2022-12-02', 
    attributes: initialAttributes
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
    //const categoryInput = fixture.nativeElement.querySelector('mat-select[name=category]').querySelector('span').innerText;
    const formCategoryValue = component.partForm?.controls['category'].value;
    expect(formCategoryValue).toBe(initialPart.category);
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

  it('should display attributes', () => {
    const attributesDetailsElement: HTMLDetailsElement = fixture.nativeElement.querySelector('details');
    const rows = attributesDetailsElement.querySelectorAll('tr');
    expect(rows.length).toBe(2);  // nb. first row is header
    const attributeInputs = rows[1].querySelectorAll('input');
    expect(attributeInputs.length).toBe(3);
    expect(attributeInputs[0].value).toBe(initialAttributes[0].name);
    expect(attributeInputs[1].value).toBe(initialAttributes[0].description ?? '');
    expect(attributeInputs[2].value).toBe(initialAttributes[0].value);
  })

  it('should submit updated values', async () => {
    const dispatchedSpy = spyOn(store, 'dispatch');
    const updatedPart: Part = { ...initialPart, name: 'Updated Name', category: PartCategory.Mechanical }    
    const nameInput: HTMLInputElement = fixture.nativeElement.querySelector('input[formControlName=name]');
    nameInput.value = updatedPart.name;
    nameInput.dispatchEvent(new Event('input'));    
    // using form controls to update becuase material selelct is messy
    component.partForm?.controls['category'].setValue(updatedPart.category);

    const submitButton: HTMLButtonElement = fixture.nativeElement.querySelector('button[type=submit]');
    submitButton.click();

    fixture.detectChanges();
    fixture.whenStable().then(() => {  
      expect(dispatchedSpy).toHaveBeenCalledWith(updatePart({part: updatedPart}));
    });
  })

  it('should close', () => {
    const dispatchedSpy = spyOn(store, 'dispatch');

    const cancelButton: HTMLButtonElement = fixture.nativeElement.querySelector('button[value=close]');
    cancelButton.click();

    expect(dispatchedSpy).toHaveBeenCalledWith(hideDetail());
  })

  it('should add attribute', async () => {
    // check initial state
    const attributesDetailsElement: HTMLDetailsElement = fixture.nativeElement.querySelector('details');
    const rows = attributesDetailsElement.querySelectorAll('tr');
    expect(rows.length).toBe(2);  // nb. first row is header

    const addAttributeButton: HTMLButtonElement = fixture.nativeElement.querySelector('button[value=addAttribute]');
    addAttributeButton.click();

    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();  
      const attributesDetailsElement: HTMLDetailsElement = fixture.nativeElement.querySelector('details');
      const rows = attributesDetailsElement.querySelectorAll('tr');
      expect(rows.length).toBe(3);  // nb. first row is header
    });
  })

  it('should delete attribute', async () => {
    // check initial state
    const attributesDetailsElement: HTMLDetailsElement = fixture.nativeElement.querySelector('details');
    const rows = attributesDetailsElement.querySelectorAll('tr');
    expect(rows.length).toBe(2);  // nb. first row is header

    const deleteAttributeButton = attributesDetailsElement.querySelector('button[value=deleteAttribute]') as HTMLButtonElement;
    deleteAttributeButton.click();

    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();  
      const attributesDetailsElement: HTMLDetailsElement = fixture.nativeElement.querySelector('details');
      const rows = attributesDetailsElement.querySelectorAll('tr');
      expect(rows.length).toBe(0);  // nb. first row is header
    });
  })

  it('should have validation error for no name', async () => {
    expect(component.partForm?.valid).toBeTrue();
    
    component.partForm?.patchValue({['name']: ''});

    expect(component.partForm?.valid).toBeFalse();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const nameInputEl: HTMLInputElement = fixture.nativeElement.querySelector('input[formControlName=name]');
      expect(nameInputEl.classList.contains('ng-invalid')).toBeTrue();
    });
  })

  it('should have validation error for weight less than zero', async () => {
    expect(component.partForm?.valid).toBeTrue();
    
    component.partForm?.patchValue({['weight']: -0.1});

    expect(component.partForm?.valid).toBeFalse();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const weightInputEl: HTMLInputElement = fixture.nativeElement.querySelector('input[formControlName=weight]');
      expect(weightInputEl.classList.contains('ng-invalid')).toBeTrue();
    });
  })

  it('should have validation error for price less than zero', async () => {
    expect(component.partForm?.valid).toBeTrue();
    
    component.partForm?.patchValue({['price']: -0.1});

    expect(component.partForm?.valid).toBeFalse();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const priceInputEl: HTMLInputElement = fixture.nativeElement.querySelector('input[formControlName=price]');
      expect(priceInputEl.classList.contains('ng-invalid')).toBeTrue();
    });
  })

  it('should have validation error for no start date', async () => {
    expect(component.partForm?.valid).toBeTrue();
    
    component.partForm?.patchValue({['startDate']: ''});

    expect(component.partForm?.valid).toBeFalse();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const dateInputEl: HTMLInputElement = fixture.nativeElement.querySelector('input[formControlName=startDate]');
      expect(dateInputEl.classList.contains('ng-invalid')).toBeTrue();
    });
  })

});
