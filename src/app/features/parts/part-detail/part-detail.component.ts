import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import Part from '../types/Part';
import PartCategory from '../types/PartCategory';

@Component({
  selector: 'app-part-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatInputModule, MatFormFieldModule],
  styleUrl: './part-detail.component.css',
  template: `
    
      <form [formGroup]="partForm" (ngSubmit)="onSubmit()">
        <h3>{{detailMode}}Part</h3>
        
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

      </form>
    
  `
})
export class PartDetailComponent {
  detailMode: string = 'Edit'
  partForm = new FormGroup({
    name: new FormControl(''),
    description: new FormControl(''),
    category: new FormControl(PartCategory.Electronic),
    weight: new FormControl(1.1),
    price: new FormControl(1.11),
    startDate: new FormControl('2020-01-01'),
    endDate: new FormControl('2024-10-10')
  })
  
  part: Part = { name: 'Part 1', description: 'The first one', category: PartCategory.Electronic, weight: 1.1, price: 1.11, startDate: '2020-01-01', endDate: '2024-10-10' } as Part

  onSubmit = () => {
    // TODO
    console.log(this.partForm.value);
  }
}
