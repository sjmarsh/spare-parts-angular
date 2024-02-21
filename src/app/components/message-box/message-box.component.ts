import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-message-box',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  template: `
    <h1 mat-dialog-title>
      {{title}}
    </h1>

    <div mat-dialog-content>
      <p>{{message}}</p>
    </div>

    <div mat-dialog-actions>
      <button mat-button (click)="onDismiss()">No</button>
      <button mat-raised-button color="primary" (click)="onConfirm()">Yes</button>
    </div>
  `,
  styleUrl: './message-box.component.css'
})
export class MessageBoxComponent {
  title?: string;
  message?: string;

  constructor(public dialogRef: MatDialogRef<MessageBoxComponent>, @Inject(MAT_DIALOG_DATA) public data: MessageBoxModel) {
    this.title = data.title;
    this.message = data.message;
  }

  onConfirm = () => {
    this.dialogRef.close(true);
  }

  onDismiss = () => {
    this.dialogRef.close(false);
  }
}

export class MessageBoxModel {
  constructor(public title: string, public message: string) {
  }
}
