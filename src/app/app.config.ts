import { ApplicationConfig, InjectionToken } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { environment } from '../environments/environment';

import { authReducer } from './features/auth/store/auth.reducers';
import { AuthEffects } from './features/auth/store/auth.effects';
import { partListReducer } from './features/parts/store/partsList.reducers';
import { PartsListEffects } from './features/parts/store/partsList.effects';
import { partReducer } from './features/parts/store/parts.reducers';
import { PartsEffects } from './features/parts/store/parts.effects';
import { partsReportReducer } from './features/parts/store/partsReport.reducers';
import { PartsReportEffects } from './features/parts/store/partsReport.effects';

export interface AppConfig {
  serverUrl?: string;
}

export let APP_CONFIG = new InjectionToken<AppConfig>('app.config');  

export let APP_CONFIG_DI: AppConfig = { 
  serverUrl: environment.serverUrl
}

export const appConfig: ApplicationConfig = {
  providers: [

    { provide: APP_CONFIG, useValue: APP_CONFIG_DI },
    provideHttpClient(),
    provideRouter(routes), 
    provideClientHydration(), 
    provideAnimations(),
    
    provideStore({login: authReducer, partList: partListReducer,  parts: partReducer, partsReport: partsReportReducer}),
    provideEffects([AuthEffects, PartsListEffects, PartsEffects, PartsReportEffects])
  ]
};
