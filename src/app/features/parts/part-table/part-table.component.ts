import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import Part from '../types/Part';
import PartCategory from '../types/PartCategory';

@Component({
  selector: 'app-part-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Category</th>
            <th>Weight</th>
            <th>Price</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let part of pageOfParts">
            <td>{{part.name}}</td>
            <td>{{part.description}}</td>
            <td>{{part.category}}</td>
            <td>{{part.weight}}</td>
            <td>{{part.price}}</td>
            <td>{{part.startDate}}</td>
            <td>{{part.endDate}}</td>
            <td></td>
            <td></td>
          </tr>
        </tbody>
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
}
