import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { Store } from '@ngrx/store';
import { fetchParts } from '../store/partsList.actions';
import { deletePart, fetchPart } from '../store/parts.actions';

import Part from '../types/Part';
import { PartDetailState } from '../store/parts.reducers';
import { PartListState } from '../store/partsList.reducers';
import FetchStatus from '../../../constants/fetchStatus';

@Component({
  selector: 'app-part-table',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule],
  template: `
    <div>
      <table mat-table [dataSource]="pageOfParts">
        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef>Name</th>
          <td mat-cell *matCellDef="let element">{{element.name}}</td>
        </ng-container>
        <ng-container matColumnDef="description">
          <th mat-header-cell *matHeaderCellDef>Description</th>
          <td mat-cell *matCellDef="let element">{{element.description}}</td>
        </ng-container>
        <ng-container matColumnDef="category">
          <th mat-header-cell *matHeaderCellDef>Category</th>
          <td mat-cell *matCellDef="let element">{{element.category}}</td>
        </ng-container>
        <ng-container matColumnDef="weight">
          <th mat-header-cell *matHeaderCellDef>Weight (kg)</th>
          <td mat-cell *matCellDef="let element">{{element.weight}}</td>
        </ng-container> 
        <ng-container matColumnDef="price">
          <th mat-header-cell *matHeaderCellDef>Price</th>
          <td mat-cell *matCellDef="let element">{{element.price}}</td>
        </ng-container>
        <ng-container matColumnDef="startDate">
          <th mat-header-cell *matHeaderCellDef>Start Date</th>
          <td mat-cell *matCellDef="let element">{{element.startDate}}</td>
        </ng-container>
        <ng-container matColumnDef="endDate">
          <th mat-header-cell *matHeaderCellDef>End Date</th>
          <td mat-cell *matCellDef="let element">{{element.endDate}}</td>
        </ng-container>
        <ng-container matColumnDef="edit">
          <th mat-header-cell *matHeaderCellDef></th>
          <td mat-cell *matCellDef="let row"><button mat-flat-button (click)="handleEdit(row)">Edit</button></td>
        </ng-container>
        <ng-container matColumnDef="delete">
          <th mat-header-cell *matHeaderCellDef></th>
          <td mat-cell *matCellDef="let row"><button mat-flat-button (click)="handleDelete(row)">Delete</button></td>
        </ng-container>
        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>

      <p>{{errorMessage}}<p>
    </div>
  `,
  styleUrl: './part-table.component.css'
})
export class PartTableComponent {

  constructor(private partStore: Store<{parts: PartDetailState}>, private partListStore: Store<{partList: PartListState}>){
  }
  pageOfParts: Array<Part> = [
  ]
  displayedColumns: string[] = ['name', 'description', 'category', 'weight', 'price', 'startDate', 'endDate', 'edit', 'delete']
  errorMessage: string = ''

  ngOnInit(): void {
    this.partListStore.select(state => state.partList).subscribe(p => {
      if(p.status === FetchStatus.Idle) {
        this.partStore.dispatch(fetchParts());
      }
      if(p.status === FetchStatus.Failed) {
        this.errorMessage = p.error ?? 'Failed to fetch parts'
      }
      if(p.status === FetchStatus.Succeeded) {
        this.pageOfParts = p.items;
      }
    })
  }

  handleEdit = (part: Part) => {
    this.partStore.dispatch(fetchPart({partId: part.id}));
  }

  handleDelete = (part: Part) => {
    console.log('delete')
    this.partStore.dispatch(deletePart({partId: part.id}));
  }
}
