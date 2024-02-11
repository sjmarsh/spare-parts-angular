import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { loginReducer } from './features/login/store/login.reducers';
import { LoginEffects } from './features/login/store/login.effects';
import { partReducer } from './features/parts/store/parts.reducers';
import { PartsEffects } from './features/parts/store/parts.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), 
    provideClientHydration(), 
    provideAnimations(),
    provideStore({login: loginReducer}),
    provideEffects(LoginEffects),
    provideStore({parts: partReducer}), 
    provideEffects(PartsEffects)
  ]
};
