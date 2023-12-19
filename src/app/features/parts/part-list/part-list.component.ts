import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PartTableComponent } from '../part-table/part-table.component';

@Component({
  selector: 'app-part-list',
  standalone: true,
  imports: [CommonModule, PartTableComponent],
  template: `
    <div>
      <h3>Part List</h3>
      <app-part-table></app-part-table>
    </div>
  `,
  styleUrl: './part-list.component.css'
})
export class PartListComponent {

}
