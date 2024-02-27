import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, ReactiveFormsModule, FormArray } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule, MatTable } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Store } from '@ngrx/store';

import Part from '../types/Part';
import PartAttribute from '../types/PartAttribute';
import PartCategory from '../types/PartCategory';
import DetailMode from '../../../constants/detailMode';
import FetchStatus from '../../../constants/fetchStatus';
import { MessageBoxModel, MessageBoxComponent } from '../../../components/message-box/message-box.component';
import { PartDetailState } from '../store/parts.reducers';
import { createPart, updatePart, hideDetail } from '../store/parts.actions';

@Component({
  selector: 'app-part-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatTableModule, MatInputModule, MatFormFieldModule, MatCardModule, MatButtonModule, MatIconModule, MatSelectModule, MatDialogModule],
  styleUrl: './part-detail.component.css',
  template: `
    <div class="part-detail">
      <form *ngIf="partForm" [formGroup]="partForm" (ngSubmit)="onSubmit()">
        <h2>{{detailMode}} Part</h2>
        
        <mat-card class="detail-card">

          <mat-form-field>
            <mat-label>Name</mat-label>
            <input matInput formControlName="name">
          </mat-form-field>
            
          <mat-form-field>
            <mat-label>Description</mat-label>
            <input matInput formControlName="description">
          </mat-form-field>
          
          <mat-form-field>
            <mat-label>Category</mat-label>
            <mat-select name="category" formControlName="category">
              <mat-option *ngFor="let cat of categories" [value]="cat">{{cat}}</mat-option>
            </mat-select>
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

        </mat-card>

        
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
    id: 0,
    name: '', 
    description: '', 
    category: PartCategory.Electronic, 
    weight: 0, 
    price: 0, 
    startDate: '2000-01-01', 
    endDate: null,
    attributes: []
  } as Part
  
  partForm?: FormGroup | null = null
  detailMode: string = ''
  errorMessage: string = ''

  @ViewChild(MatTable) table!: MatTable<any>; // ref: https://stackoverflow.com/questions/49284358/calling-renderrows-on-angular-material-table/50495353#50495353
  displayedColumns: string[] = ['name', 'description', 'value', 'delete']
  
  categories = Object.keys(PartCategory)

  constructor(public dialog: MatDialog, private store: Store<{parts: PartDetailState}>){
  }

  ngOnInit(): void {   
    this.store.select(state => state.parts)
      .subscribe(s => {
        this.detailMode = s.mode;
        if(s.status === FetchStatus.Succeeded){
          this.part = {...s.value};
          this.partForm = this.initForm(this.part);
        }
        if(s.status === FetchStatus.Failed) {
          this.errorMessage = s.error ?? 'Something went wrong while trying to fetch part';
        }        
      })
  }

  private initForm = (part: Part) : FormGroup => {
    let fg = new FormGroup({
      id: new FormControl(part.id),
      name: new FormControl(part.name),
      description: new FormControl(part.description),
      category: new FormControl(part.category),
      weight: new FormControl(part.weight),
      price: new FormControl(part.price),
      startDate: new FormControl(this.getDateForPicker(part.startDate)),
      endDate: new FormControl(this.getDateForPicker(part.endDate)),
      attributes: new FormArray<FormGroup>([])
    });
    if(this.part.attributes && this.part.attributes.length > 0){
      const attrArray = fg.get('attributes') as FormArray;
      this.part.attributes.forEach(attr => {
        attrArray.push(new FormGroup({
          name: new FormControl(attr.name),
          description: new FormControl(attr.description),
          value: new FormControl(attr.value)
        }));
      });
    }
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

  private getDateForPicker = (dateString?: string | null) => {
    if(!dateString) {
        return '';
    }
    return dateString.substring(0, 10);
  }

  onSubmit = () => {
    console.log(`submit mode: ${this.detailMode}`);
    if(this.partForm == null) {
      // todo better error handling
      throw('unable to submit null form')
    }
    const partToSubmit = this.partForm.value;
    partToSubmit.startDate = partToSubmit.startDate.length > 0 ? partToSubmit.startDate : null;
    partToSubmit.endDate = partToSubmit.endDate.length > 0 ? partToSubmit.endDate : null;
    
    if(this.detailMode === DetailMode.Add) {
      partToSubmit.id = 0;
      this.store.dispatch(createPart({part: partToSubmit}));
    }
    else {
      this.store.dispatch(updatePart({part: partToSubmit}));
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
    const messageBoxData = new MessageBoxModel('Confirm Delete', 'Are you sure you want to delete this attribute?');
    const messageBoxRef = this.dialog.open(MessageBoxComponent, { maxWidth: '400px', data: messageBoxData});
    messageBoxRef.afterClosed().subscribe((shouldDelete: boolean) => {
      if(shouldDelete) {    
        const attrArray = this.getAttributeFormArray();
        const attrIndex = attrArray.value.findIndex(a => a === attribute);
        attrArray.removeAt(attrIndex);
        this.table.renderRows();        
      }  
    });
  }
}
