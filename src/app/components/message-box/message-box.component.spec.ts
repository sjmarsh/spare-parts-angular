import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageBoxComponent } from './message-box.component';
import { provideAnimations } from '@angular/platform-browser/animations';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DebugElement } from '@angular/core';

describe('MessageBoxComponent', () => {
  let component: MessageBoxComponent;
  let fixture: ComponentFixture<MessageBoxComponent>;
  let el: DebugElement;
  let matDialogRef;
  const matDialogSpy = jasmine.createSpyObj('MatDialogRef', ['onNoClick', 'closeDialog']);
  const data = {
    title: 'Message Title',
    message: 'The Message',
    summary: 'The message summary'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageBoxComponent], 
      providers: [
        {
          provide: MatDialogRef,
          useValue: matDialogSpy
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: data
        }
      ]
    })
    .compileComponents()
    .then(() => {
      fixture = TestBed.createComponent(MessageBoxComponent);
      component = fixture.componentInstance;
      el = fixture.debugElement;
      matDialogRef = TestBed.get(MatDialogRef);
      fixture.detectChanges();
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
