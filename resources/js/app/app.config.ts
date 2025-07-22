import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors, withFetch , withXsrfConfiguration} from '@angular/common/http';
import { authInterceptor } from './auth/services/auth.interceptor';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import customtheme from './customtheme';
import { MessageService } from 'primeng/api';




export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([authInterceptor]),
      withFetch(),
      withXsrfConfiguration({
        cookieName: 'XSRF-TOKEN',
        headerName: 'x-xsrf-token',
      }),
    ),
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    MessageService,
    provideRouter(routes), provideClientHydration(withEventReplay()),
    provideAnimationsAsync(),
        providePrimeNG({
          theme: {
            preset: customtheme,
            options: {
                prefix: 'p',
                darkModeSelector: '.app-dark',
                cssLayer: false
            }
        }
        })
  ]
};
