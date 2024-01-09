import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table'
import { MatButtonModule } from '@angular/material/button';

import Part from '../types/Part';
import PartCategory from '../types/PartCategory';

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
          <td mat-cell *matCellDef="let row"><button mat-flat-button>Edit</button></td>
        </ng-container>
        <ng-container matColumnDef="delete">
          <th mat-header-cell *matHeaderCellDef></th>
          <td mat-cell *matCellDef="let row"><button mat-flat-button>Delete</button></td>
        </ng-container>
        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>
    </div>
  `,
  styleUrl: './part-table.component.css'
})
export class PartTableComponent {
  pageOfParts: Array<Part> = [
    { id: 1, name: 'Part 1', description: 'Part 1 Desc', category: PartCategory.Electronic, weight: 1.1, price: 1.11, startDate: '2000-02-01' } as Part,
    { id: 2, name: 'Part 2', description: 'Part 2 Desc', category: PartCategory.Electronic, weight: 2.1, price: 2.11, startDate: '2022-02-02' } as Part
  ]
  displayedColumns: string[] = ['name', 'description', 'category', 'weight', 'price', 'startDate', 'endDate', 'edit', 'delete']
}
