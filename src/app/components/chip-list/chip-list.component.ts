import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card'; 
import { MatIconModule } from '@angular/material/icon';

import Chip from './types/chip';

@Component({
    selector: 'app-chip-list',
      standalone: true,
      imports: [CommonModule, MatCardModule, MatIconModule],
      template: `
        <mat-card aria-label="Chip List" role="listbox" appearance="outlined">
            <ng-container *ngIf="chipTitle">
                <mat-card-header>
                    <mat-card-title>{{chipTitle}}</mat-card-title>
                </mat-card-header>
            </ng-container>
            <mat-card-content>
                <ng-container *ngIf="chips">
                    @for (chipItem of chips; track $index) {
                        <span class="{{getChipClass(chipItem)}}" title="{{chipItem.tooltip}}" role="option">{{chipItem.name}}<span class="chipIcon"><a (click)="handleChipToggle(chipItem)"><span class=""><mat-icon>cancel</mat-icon></span></a></span></span>
                    }
                </ng-container>
            </mat-card-content>
        </mat-card>
      `,
      styleUrl: './chip-list.component.css'
})
export class ChipListComponent {
    @Input({required: true}) chips?: Array<Chip> | null;
    @Input({required: false}) chipTitle?: string | null;
    @Input({required: true}) onToggleChip?: (chip: Chip) => void | null;

    constructor() {
    }

    handleChipToggle = (chip: Chip) => {
        if(this.onToggleChip) {
            chip.isActive = !chip.isActive;
            this.onToggleChip(chip);
        }
    }

    getChipClass = (chip: Chip) : string => {
        let outlined = chip.isActive ? '' : 'Outlined';
        const chipColorClass = `chipColor${chip.color}${outlined}`;
        return (chip.color === null || chip.color === undefined) ? `chip chipColorDefault` : `chip ${chipColorClass}`;
    }
}