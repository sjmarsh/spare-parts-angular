import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog'
import { Store } from '@ngrx/store';
import { PartDetailState } from '../store/parts.reducers';

import { PartTableComponent } from '../part-table/part-table.component';
import { PartDetailComponent } from '../part-detail/part-detail.component';
import FetchStatus from '../../../constants/fetchStatus';
import DetailMode from '../../../constants/detailMode';
import { hideDetail } from '../store/parts.actions';

@Component({
  selector: 'app-part-list',
  standalone: true,
  imports: [CommonModule, MatProgressBarModule, MatDialogModule, PartTableComponent, PartDetailComponent],
  template: `
    <div class="part-list">
      <ng-container *ngIf="isLoading">
        <mat-progress-bar mode="indeterminate"></mat-progress-bar>
      </ng-container>
      <h2>Part List</h2>
      <app-part-table></app-part-table>
    </div>
  `,
  styleUrl: './part-list.component.css'
})
export class PartListComponent {
  fetchStatus?: FetchStatus
  isLoading?: Boolean = this.fetchStatus && this.fetchStatus == FetchStatus.Loading

  constructor(public dialog: MatDialog, private store: Store<{parts: PartDetailState}>) {
    this.store.select(state => state.parts)
    .subscribe(s => {           
      this.fetchStatus = s.status;
      if (s && s.mode == DetailMode.Edit || s.mode == DetailMode.Add) {
        this.showDetail();
      }
      if (s && s.mode == DetailMode.Closed) {
        this.dialog.closeAll();
      }      
    })
  }
 
  showDetail = () => {
    const dialogRef = this.dialog.open(PartDetailComponent, { height: '90%', width: '800px', maxWidth: '90vw' });
    dialogRef.afterClosed().subscribe(res => {
      this.store.dispatch(hideDetail());
    })
  }

}
