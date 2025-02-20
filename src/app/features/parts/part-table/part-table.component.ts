import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Store } from '@ngrx/store';

import Part from '../types/Part';
import FetchStatus from '../../../constants/fetchStatus';
import DetailMode from '../../../constants/detailMode';
import TableSettings from '../../../constants/tableSettings';
import { MessageBoxModel, MessageBoxComponent } from '../../../components/message-box/message-box.component';
import { PartDetailState } from '../store/parts.reducers';
import { PartListState } from '../store/partsList.reducers';
import { PartReportState } from '../store/partsReport.reducers';
import { fetchParts, setCurrentPage } from '../store/partsList.actions';
import { showDetail, deletePart, fetchPart } from '../store/parts.actions';
import { fetchReport } from '../store/partsReport.actions';

@Component({
  selector: 'app-part-table',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatButtonModule, MatIconModule, MatDialogModule, MessageBoxComponent],
  template: `
    <div>
      <div class='tool-container'>
        <button mat-fab extended color="primary" class="tool-button" value="report" (click)="handleFetchReport()">
          <mat-icon>print</mat-icon>
          Report
        </button>       
        <button mat-fab extended color="primary" class="tool-button" value="add" (click)="handleAddPart()">
          <mat-icon>add</mat-icon>
          Add Part
        </button>
       </div>
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
          <td mat-cell *matCellDef="let element">{{element.startDate | date:'dd/MM/yyyy'}}</td>
        </ng-container>
        <ng-container matColumnDef="endDate">
          <th mat-header-cell *matHeaderCellDef>End Date</th>
          <td mat-cell *matCellDef="let element">{{element.endDate | date:'dd/MM/yyyy'}}</td>
        </ng-container>
        <ng-container matColumnDef="edit">
          <th mat-header-cell *matHeaderCellDef></th>
          <td mat-cell *matCellDef="let row"><button mat-flat-button value="edit" (click)="handleEdit(row)">Edit</button></td>
        </ng-container>
        <ng-container matColumnDef="delete">
          <th mat-header-cell *matHeaderCellDef></th>
          <td mat-cell *matCellDef="let row"><button mat-flat-button value="delete" (click)="handleDelete(row)">Delete</button></td>
        </ng-container>
        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>
      <mat-paginator
        (page)="handlePageEvent($event)"
        [length]="totalItemCount"
        [pageSize]="pageSize"
        [pageIndex]="currentPage"
        [showFirstLastButtons]="true"
        aria-label="Select parts list page"
      >
      </mat-paginator>
      <p>{{errorMessage}}<p>
    </div>
  `,
  styleUrl: './part-table.component.css'
})
export class PartTableComponent {

  constructor(public dialog: MatDialog, private partStore: Store<{parts: PartDetailState}>, private partListStore: Store<{partList: PartListState}>, private partsReportStore: Store<{partsReportStore: PartReportState}>){
  }

  pageOfParts: Array<Part> = []
  displayedColumns: string[] = ['name', 'description', 'category', 'weight', 'price', 'startDate', 'endDate', 'edit', 'delete']
  totalItemCount: number = 0
  pageSize: number = TableSettings.PageSize
  currentPage: number = 0
  errorMessage: string = ''

  ngOnInit(): void {
    this.partListStore.select(state => state.partList).subscribe(p => {
      if(p && p.status === FetchStatus.Idle && p.items.length === 0) {
        this.partListStore.dispatch(fetchParts({page: this.currentPage}));
      }
      if(p && p.status === FetchStatus.Failed) {
        this.errorMessage = p.error ?? 'Failed to fetch parts'
      }
      if(p && p.status === FetchStatus.Succeeded) {
        this.pageOfParts = p.items;
        this.totalItemCount = p.totalItemCount;
        this.currentPage = p.currentPage ?? 0;
      }
    })
  }

  handleFetchReport = () => {
    this.partsReportStore.dispatch(fetchReport());
  }

  handleAddPart = () => {
    this.partStore.dispatch(showDetail({mode: DetailMode.Add}));
  }

  handleEdit = (part: Part) => {
    this.partStore.dispatch(fetchPart({partId: part.id}));
  }

  handleDelete = (part: Part) => {
    const messageBoxData = new MessageBoxModel('Confirm Delete', 'Are you sure you want to delete this part?');
    const messageBoxRef = this.dialog.open(MessageBoxComponent, { maxWidth: '400px', data: messageBoxData});
    messageBoxRef.afterClosed().subscribe((shouldDelete: boolean) => {
      if(shouldDelete) {
        this.partStore.dispatch(deletePart({partId: part.id}));
      }  
    });
  }

  handlePageEvent = (e: PageEvent) => {
    this.currentPage = e.pageIndex;
    this.partListStore.dispatch(setCurrentPage({page: e.pageIndex}));
    this.partListStore.dispatch(fetchParts({page: e.pageIndex}));
  }
}
