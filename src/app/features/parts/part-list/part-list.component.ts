import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog'
import { Store } from '@ngrx/store';
import { PartDetailState } from '../store/parts.reducers';

import { PartTableComponent } from '../part-table/part-table.component';
import { PartDetailComponent } from '../part-detail/part-detail.component';
import DetailMode from '../../../constants/detailMode';
import { hideDetail } from '../store/parts.actions';

@Component({
  selector: 'app-part-list',
  standalone: true,
  imports: [CommonModule, MatDialogModule, PartTableComponent, PartDetailComponent],
  template: `
    <div>
      <h3>Part List</h3>
      <app-part-table></app-part-table>
      <button mat-raised-button (click)="showDetail()">Show Detail Test</button>
      
    </div>
  `,
  styleUrl: './part-list.component.css'
})
export class PartListComponent {
  
  constructor(public dialog: MatDialog, private store: Store<PartDetailState>) {
    
    
    this.store.select(state => state)
      .subscribe(s => {
                       
        console.log(s)
        console.log({s}.s.mode)
        
        if (s && s.mode == "Edit") {
          console.log('show')
          this.showDetail();
        }
      })
  }

  
  showDetail = () => {
    
    const dialogRef = this.dialog.open(PartDetailComponent);

    dialogRef.afterClosed().subscribe(res => {
      console.log('part detail dialog closed');
      this.store.dispatch(hideDetail());
    })
  }

}
