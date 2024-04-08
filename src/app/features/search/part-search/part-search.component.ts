import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, ReactiveFormsModule, FormArray, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';

@Component({
    selector: 'app-part-search',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    styleUrl: './part-search.component.css',
    template: `
    <div class="part-search">
        <h2>Part Search</h2>
    </div>
    `
})

export class PartSearchComponent {

}