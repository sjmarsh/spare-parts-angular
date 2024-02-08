import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, ReactiveFormsModule, FormBuilder, FormArray, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule, MatTable } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';

import Part from '../types/Part';
import PartAttribute from '../types/PartAttribute';
import PartCategory from '../types/PartCategory';
import DetailMode from '../../../constants/detailMode';
import FetchStatus from '../../../constants/fetchStatus';
import { PartDetailState } from '../store/parts.reducers';
import { createPart, updatePart, hideDetail } from '../store/parts.actions';

@Component({
  selector: 'app-part-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatTableModule, MatInputModule, MatFormFieldModule, MatCardModule, MatButtonModule, MatIconModule],
  styleUrl: './part-detail.component.css',
  template: `
    <div class="part-detail">
      <form [formGroup]="partForm" (ngSubmit)="onSubmit()">
        <h2>{{detailMode}} Part</h2>
        
        <mat-card class="detail-card">

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

        <details>
          <summary>Attributes</summary>
          <mat-card class="attributes-card">
            <button mat-icon-button aria-label="Add attribute" type="button" (click)="addAttribute()">
              <mat-icon>add</mat-icon>
            </button>
            <div *ngIf="getAttributeFormArray().controls.length > 0">
              <table mat-table [dataSource]="getAttributeFormArray().controls">
                <ng-container matColumnDef="name">
                  <th mat-header-cell *matHeaderCellDef>Name</th>
                  <td mat-cell *matCellDef="let element">
                    <input [formControl]="element.get('name')">
                  </td>
                </ng-container>
                <ng-container matColumnDef="description">
                  <th mat-header-cell *matHeaderCellDef>Description</th>
                  <td mat-cell *matCellDef="let element">
                    <input [formControl]="element.get('description')">
                  </td>
                </ng-container> 
                <ng-container matColumnDef="value">
                  <th mat-header-cell *matHeaderCellDef>Value</th>
                  <td mat-cell *matCellDef="let element">
                    <input [formControl]="element.get('value')">
                  </td>
                </ng-container>
                <ng-container matColumnDef="delete">
                  <th mat-header-cell *matHeaderCellDef></th>
                  <td mat-cell *matCellDef="let element">
                    <button mat-flat-button type="button" (click)="deleteAttribute(element)">Delete</button>
                  </td>
                </ng-container>
                <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
              </table> 
            </div>
          </mat-card>
        </details>

        <button mat-flat-button color="primary" type="submit">Submit</button>
        <button mat-flat-button type="button" (click)="handleClose()">Close</button>

        <mat-error>{{errorMessage}}</mat-error>
      </form> 
    </div>   
  `
})

//ref: https://netbasal.com/angular-reactive-forms-the-ultimate-guide-to-formarray-3adbe6b0b61a

export class PartDetailComponent {
  part: Part = { 
    name: '', 
    description: '', 
    category: PartCategory.Electronic, 
    weight: 0, 
    price: 0, 
    startDate: '2000-01-01', 
    endDate: null
  } as Part
  
  partForm: FormGroup
  detailMode: string = ''
  errorMessage: string = ''

  @ViewChild(MatTable) table!: MatTable<any>; // ref: https://stackoverflow.com/questions/49284358/calling-renderrows-on-angular-material-table/50495353#50495353
  displayedColumns: string[] = ['name', 'description', 'value', 'delete']
  
  constructor(private store: Store<{parts: PartDetailState}>, private formBuilder: FormBuilder){
    this.partForm = this.initForm(this.part)
  }

  ngOnInit(): void {   
    this.store.select(state => state.parts)
      .subscribe(s => {
        if(s.status === FetchStatus.Succeeded){
          this.part = {...s.value};
          this.partForm = this.initForm(this.part);
          this.detailMode = s.mode;
          if(this.part.attributes && this.part.attributes.length > 0){
            const attrArray = this.partForm.get('attributes') as FormArray;
            this.part.attributes.forEach(attr => {
              attrArray.push(new FormGroup({
                name: new FormControl(attr.name),
                description: new FormControl(attr.description),
                value: new FormControl(attr.value)
              }));
            });
          }
        }
        if(s.status === FetchStatus.Failed) {
          this.errorMessage = s.error ?? 'Something went wrong while trying to fetch part';
        }        
      })
  }

  initForm = (part: Part) : FormGroup => {
    console.log('init Form')
    console.log(part)
    let fg = new FormGroup({
      name: new FormControl(part.name),
      description: new FormControl(part.description),
      category: new FormControl(part.category),
      weight: new FormControl(part.weight),
      price: new FormControl(part.price),
      startDate: new FormControl(part.startDate),
      endDate: new FormControl(part.endDate),
      attributes: new FormArray<FormGroup>([])
    });
    return fg;
  }

  getAttributeFormArray = () : FormArray<FormGroup> => {
    const defaultValue = new FormArray<FormGroup>([])
    if(!this.partForm) {
      return defaultValue;
    }
    const attribs = this.partForm.get('attributes') as FormArray
    if(!attribs) {
      return defaultValue;
    }
    return attribs;
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

  addAttribute = () => {
    const attrArray = this.getAttributeFormArray();
    attrArray.push(new FormGroup({
      name: new FormControl(''),
      description: new FormControl(''),
      value: new FormControl('')
    }));
    this.table.renderRows();
  }

  deleteAttribute = (attribute: PartAttribute) => {
    // todo add a confirmation message before deleting
    const attrArray = this.getAttributeFormArray();
    const attrIndex = attrArray.value.findIndex(a => a === attribute);
    attrArray.removeAt(attrIndex);
    this.table.renderRows();
  }
}
