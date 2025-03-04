import { Component, ViewChild, importProvidersFrom } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { HttpClientModule } from '@angular/common/http';

import { AuthorizationService } from './features/auth/services/authorization-service';
import UserRoles from './constants/userRoles';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    RouterLink, 
    RouterLinkActive, 
    RouterOutlet, 
    HttpClientModule,
    MatButtonModule, 
    MatIconModule, 
    MatListModule,
    MatSidenavModule, 
    MatToolbarModule
  ],
  
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

// ref: https://dev.to/davidihl/how-to-create-a-responsive-sidebar-and-mini-navigation-with-material-angular-o5l#Import-required-components

export class AppComponent {
  title = 'spare-parts-angular';
  @ViewChild(MatSidenav)
  sidenav!:MatSidenav;
  isMobile = true;
  isCollapsed = false;
  readonly userRoles = UserRoles
  authirzationService?: AuthorizationService

  constructor(private observer: BreakpointObserver, private authorizationService: AuthorizationService){
    this.authirzationService = authorizationService
  }

  ngOnInit() {
    this.observer.observe(['(max-width: 800px)']).subscribe((screenSize) => {
      if(screenSize.matches) {
        this.isMobile = true;
        this.isCollapsed = true;
      } else {
        this.isMobile = false;
      }
    })
  }

  toggleMenu() {
    if(this.isMobile) {
      this.sidenav.toggle();
      this.isCollapsed = false;
    } else {
      this.sidenav.open();
      this.isCollapsed = !this.isCollapsed;
    }
  }
}