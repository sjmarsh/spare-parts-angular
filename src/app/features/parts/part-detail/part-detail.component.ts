import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import Part from '../types/Part';

@Component({
  selector: 'app-part-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatInputModule, MatFormFieldModule],
  styleUrl: './part-detail.component.css',
  template: `
    
      <form [formGroup]="partForm"] (ngSubmit)="onSubmit()">
        <h3>{{detailMode}}Part</h3>
        
          <mat-form-field appearance="fill">
            <mat-label>Enter Name<mat-label>
            <input matInput placeholder="Name" formControlName="name" />
            <mat-hint>Name<mat-hint>
          </mat-form-field>

          <mat-form-field appearance="fill">
            <mat-label>Enter Description<mat-label>
            <input matInput placeholder="Description" formControlName="description" />
            <mat-hint>Description<mat-hint>
          </mat-form-field>

        
      </form>
    
  `
})
export class PartDetailComponent {
  detailMode: string = 'Edit'
  partForm = new FormGroup({
    name: new FormControl(''),
    description: new FormControl('')
  })
  
  part: Part = { name: 'Part 1', description: 'The first one' , weight: 1.1 } as Part

  onSubmit = () => {
    // TODO
    console.log(this.partForm.value);
  }
}
