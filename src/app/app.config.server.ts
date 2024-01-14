import { mergeApplicationConfig, ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { appConfig } from './app.config';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering()
  ]
};

/* //ref: https://blog.mihaioltean.com/how-to-use-ngrx-and-standalone-components
bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      StoreModule.forRoot({}),
      StoreModule.forFeature('part', PartReducer)
    )
  ]
})
 */

export const config = mergeApplicationConfig(appConfig, serverConfig);
