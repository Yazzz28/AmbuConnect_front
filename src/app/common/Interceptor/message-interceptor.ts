import { HttpHandlerFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { catchError, tap } from 'rxjs';

const STATUS_INF = 200;
const STATUS_SUP = 300;

export const messageInterceptor = (req: HttpRequest<unknown>, next: HttpHandlerFn): ReturnType<HttpHandlerFn> => {
  const messageService = inject(MessageService);

  return next(req).pipe(
    catchError(error => {
      let message = 'Une erreur est survenue';

      if (error.error instanceof ErrorEvent) {
        message = error.error.message;
      } else if (typeof error.error === 'string') {
        message = error.error;
      } else if (error.error?.message) {
        message = error.error.message;
      } else {
        message = JSON.stringify(error.error);
      }

      messageService.add({ severity: 'error', summary: 'Erreur', detail: message });
      throw error;
    }),
    tap(event => {
      if (
        event instanceof HttpResponse &&
        ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method.toUpperCase()) &&
        event.status >= STATUS_INF &&
        event.status < STATUS_SUP
      ) {
        messageService.add({ severity: 'success', summary: 'Succès', detail: "L'opération a réussi." });
      }
    })
  );
};
