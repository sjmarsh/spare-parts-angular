import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartTableComponent } from './part-table.component';

describe('PartTableComponent', () => {
  let component: PartTableComponent;
  let fixture: ComponentFixture<PartTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PartTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PartTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
