import { Routes } from '@angular/router';

import { HomeComponent } from './features/home/home.component';
import { LoginComponent } from './features/auth/login.component';
import { LogoutComponent } from './features/auth/logout.component';
import { PartListComponent } from './features/parts/part-list/part-list.component';
import { PartReportComponent } from './features/parts/part-report/part-report.component';
import { InventoryHomeComponent } from './features/inventory/inventory-home/inventory-home.component';
import { InventoryReportComponent } from './features/inventory/inventory-report/inventory-report.component';
import { PartSearchComponent } from './features/search/part-search/part-search.component';
import { partListGuard } from './features/auth/guards/part-list.guard';
import { inventoryGuard } from './features/auth/guards/inventory-guard';
import { partSearchGuard } from './features/auth/guards/part-search.guard';

export const routes: Routes = [
    { path: 'home', title: 'Home', component: HomeComponent },
    { path: 'login', title: 'Login', component: LoginComponent },
    { path: 'logout', title: 'Logout', component: LogoutComponent },
    { path: 'part-list', title: 'Part List', canActivate: [partListGuard], component: PartListComponent },
    { path: 'part-report', title: 'Part Report', canActivate: [partListGuard], component: PartReportComponent },
    { path: 'inventory', title: 'Inventory', canActivate: [inventoryGuard], component: InventoryHomeComponent },
    { path: 'inventory-report', title: 'Inventory Report', canActivate: [inventoryGuard], component: InventoryReportComponent },
    { path: 'part-search', title: 'Part Search', canActivate: [partSearchGuard], component: PartSearchComponent},
    { path: '**', component: HomeComponent }
];
