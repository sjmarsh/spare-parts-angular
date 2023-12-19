import { Routes } from '@angular/router';

import { HomeComponent } from './features/home/home.component';
import { PartListComponent } from './features/parts/part-list/part-list.component';

export const routes: Routes = [
    { path: 'home', title: 'Home', component: HomeComponent },
    { path: 'part-list', title: 'Part List', component: PartListComponent }
];
