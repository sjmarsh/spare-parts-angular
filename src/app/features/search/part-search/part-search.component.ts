import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, ReactiveFormsModule, FormArray, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';

import { FilterGridComponent } from '../../../components/filter/filter-grid/filter-grid.component';

@Component({
    selector: 'app-part-search',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, FilterGridComponent],
    styleUrl: './part-search.component.css',
    template: `
    <div class="part-search">
        <h2>Part Search</h2>
        <app-filter-grid></app-filter-grid>
    </div>
    `
})

export class PartSearchComponent {

}