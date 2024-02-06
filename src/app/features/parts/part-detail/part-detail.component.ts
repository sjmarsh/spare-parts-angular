import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { Store } from '@ngrx/store';

import Part from '../types/Part';
import PartCategory from '../types/PartCategory';
import FetchStatus from '../../../constants/fetchStatus';
import { PartDetailState } from '../store/parts.reducers';
import DetailMode from '../../../constants/detailMode';
import { createPart, updatePart, hideDetail } from '../store/parts.actions';

@Component({
  selector: 'app-part-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatInputModule, MatFormFieldModule, MatCardModule, MatButtonModule],
  styleUrl: './part-detail.component.css',
  template: `
    <div class="part-detail">
      <form [formGroup]="partForm" (ngSubmit)="onSubmit()">
        <h2>{{detailMode}} Part</h2>
        
        <mat-card class="custom-card">

          <mat-form-field>
            <mat-label>Enter Name</mat-label>
            <input matInput formControlName="name">
          </mat-form-field>
            
          <mat-form-field>
            <mat-label>Description</mat-label>
            <input matInput formControlName="description">
          </mat-form-field>
          
          <mat-form-field>
            <mat-label>Category</mat-label>
            <input matInput formControlName="category">
          </mat-form-field>

          <mat-form-field>
            <mat-label>Weight</mat-label>
            <input matInput type="number" formControlName="weight">
          </mat-form-field>

          <mat-form-field>
            <mat-label>Price</mat-label>
            <input matInput type="number" formControlName="price">
            <span matTextPrefix>$&nbsp;</span>
          </mat-form-field>

          <mat-form-field>
            <mat-label>Start Date</mat-label>
            <input matInput type="date" formControlName="startDate">
          </mat-form-field>

          <mat-form-field>
            <mat-label>End Date</mat-label>
            <input matInput type="date" formControlName="endDate">
          </mat-form-field>

        </mat-card>

        <button mat-flat-button color="primary" type="submit">Submit</button>
        <button mat-flat-button color="secondary" type="button" (click)="handleClose()">Close</button>

        <mat-error>{{errorMessage}}</mat-error>
      </form> 
    </div>   
  `
})

export class PartDetailComponent {
  part: Part = { name: '', description: '', category: PartCategory.Electronic, weight: 0, price: 0, startDate: '2000-01-01', endDate: null } as Part
  partForm: FormGroup
  detailMode: string = ''
  errorMessage: string = ''
  
  constructor(private store: Store<{parts: PartDetailState}>){
    this.partForm = this.initForm(this.part)
  }

  ngOnInit(): void {   
    this.store.select(state => state.parts)
      .subscribe(s => {
        if(s.status === FetchStatus.Succeeded){
          this.part = s.value;
          this.partForm = this.initForm(this.part);
          this.detailMode = s.mode;
        }
        if(s.status === FetchStatus.Failed) {
          this.errorMessage = s.error ?? 'Something went wrong while trying to fetch part';
        }
        
      })
  }

  initForm = (part: Part) : FormGroup => {
    console.log('init Form')
    console.log(part)
    return new FormGroup({
      name: new FormControl(part.name),
      description: new FormControl(part.description),
      category: new FormControl(part.category),
      weight: new FormControl(part.weight),
      price: new FormControl(part.price),
      startDate: new FormControl(part.startDate),
      endDate: new FormControl(part.endDate)
    })
  }

  onSubmit = () => {
    console.log(`submit mode: ${this.detailMode}`);
    if(this.detailMode == DetailMode.Add) {
      this.store.dispatch(createPart({part: this.partForm.value}));
    }
    else {
      this.store.dispatch(updatePart({part: this.partForm.value}));
    }
  }

  handleClose = () => {
    this.store.dispatch(hideDetail());
  }
}
