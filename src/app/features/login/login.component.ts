import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';


@Component({
    selector: 'apt-login',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, MatInputModule, MatFormFieldModule, MatCardModule, MatButtonModule, MatIconModule],
    styleUrl: './login.component.css',
    template: `
    <div>
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <h2>Login</h2>

            <mat-card>
                <mat-form-field>
                    <mat-label>User Name</mat-label>
                    <input matInput formControlName="userName">
                </mat-form-field>
                <mat-form-field>
                    <mat-label>Password</mat-label>
                    <input matInput formControlName="password">
                </mat-form-field>
            </mat-card>
            <button mat-flat-button color="primary" type="submit">Login</button>
        </form>
        <mat-error>{{errorMessage}}</mat-error>
    </div>
    `
})

export class LoginComponent {
    
    loginForm = new FormGroup({ 
        userName: new FormControl(String),
        password: new FormControl(String)
    })
    errorMessage: String = ''

    constructor(private store: Store<{}>){
    }

    onSubmit = () => {

    }

}