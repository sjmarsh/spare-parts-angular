import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';

import { login } from './store/auth.actions';
import { AuthState } from './store/auth.reducers';
import FetchStatus from '../../constants/fetchStatus';

@Component({
    selector: 'apt-login',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, MatInputModule, MatFormFieldModule, MatCardModule, MatButtonModule, MatIconModule],
    styleUrl: './login.component.css',
    template: `
    <div class="login">
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <h2>Login</h2>
            <p>You are not logged in. Please log in below.</p>
            <mat-card class="login-card">
                <mat-form-field>
                    <mat-label>User Name</mat-label>
                    <input matInput formControlName="userName">
                </mat-form-field>
                <mat-form-field>
                    <mat-label>Password</mat-label>
                    <input type="password" matInput formControlName="password">
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
        userName: new FormControl(''),
        password: new FormControl('')
    })

    hasError: boolean = false;
    errorMessage: String = ''

    constructor(private store: Store<{login: AuthState}>, private router: Router){
    }

    ngOnInit(): void {
        this.store.select(state => state.login)
            .subscribe(s => {
                if(s) {
                    this.hasError = s.fetchStatus === FetchStatus.Failed
                    this.errorMessage = s.error ?? ''
                    if(s.fetchStatus === FetchStatus.Succeeded && s.isAuthenticated) {
                        this.router.navigate(['/home']);
                    }
                    
                }
            })
    }

    onSubmit = () => {
        // todo validate
        this.store.dispatch(login({request: this.loginForm.value}))
    }
}