import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { authInterceptor } from './common/Interceptor/auth-interceptor';
import { messageInterceptor } from './common/Interceptor/message-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor, messageInterceptor])),
    provideAnimationsAsync(),
    providePrimeNG(),
    importProvidersFrom(ToastModule),
    { provide: MessageService, useClass: MessageService },
  ],
};
