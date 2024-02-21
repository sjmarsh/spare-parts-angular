import { Routes } from '@angular/router';

import { HomeComponent } from './features/home/home.component';
import { LoginComponent } from './features/auth/login.component';
import { LogoutComponent } from './features/auth/logout.component';
import { PartListComponent } from './features/parts/part-list/part-list.component';
import { adminGuard } from './features/auth/guards/admin-guard.guard';

export const routes: Routes = [
    { path: 'home', title: 'Home', component: HomeComponent },
    { path: 'login', title: 'Login', component: LoginComponent },
    { path: 'logout', title: 'Logout', component: LogoutComponent },
    { path: 'part-list', title: 'Part List', canActivate: [adminGuard], component: PartListComponent },
    { path: '**', component: HomeComponent }
];
