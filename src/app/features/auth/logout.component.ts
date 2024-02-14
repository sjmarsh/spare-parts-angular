import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { logout } from './store/auth.actions';
import { AuthState } from './store/auth.reducers';

@Component({
    selector: 'apt-logout',
    standalone: true,
    imports: [CommonModule],
    styleUrl: './logout.component.css',
    template: ``
})

export class LogoutComponent {

    constructor(private store: Store<{login: AuthState}>, private router: Router){
    }

    ngOnInit(): void {
        this.store.dispatch(logout());
    }
}