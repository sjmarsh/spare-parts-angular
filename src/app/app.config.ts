import { ApplicationConfig } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { authReducer } from './features/auth/store/auth.reducers';
import { AuthEffects } from './features/auth/store/auth.effects';
import { partReducer } from './features/parts/store/parts.reducers';
import { PartsEffects } from './features/parts/store/parts.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideRouter(routes), 
    provideClientHydration(), 
    provideAnimations(),
    
    provideStore({login: authReducer, parts: partReducer}),
    provideEffects([AuthEffects, PartsEffects])
  ]
};
