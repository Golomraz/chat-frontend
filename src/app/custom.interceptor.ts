import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, filter, retry, switchMap, take, throwError } from 'rxjs';
import { env } from 'src/environment';
import { AuthService } from './auth/auth.service';

@Injectable()
export class CustomInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );
  get accessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  get refreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  constructor(private authService: AuthService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    console.error(req);
    if (this.accessToken || this.refreshToken) {
      req = this._addToken(req, this.accessToken || this.refreshToken || '');
    }
    const apiReq = req.clone({
      url: `${env.API_URL}/${req.url}`,
    });
    return next.handle(apiReq).pipe(
      catchError((e) => {
        if (e instanceof HttpErrorResponse && e.status === 401) {
            return this.handle401Error(req, next);
        } else {
            return throwError(e);
          }
      })
    );
  }

  private _addToken(req: HttpRequest<any>, token: string) {
    return req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    localStorage.removeItem('accessToken');
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.authService.refreshToken().pipe(
        switchMap((token: any) => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(token['result']?.accessToken);
          return next.handle(this._addToken(request, token['result']?.accessToken));
        })
      );
    } else {
      return this.refreshTokenSubject.pipe(
        filter((token) => token != null),
        take(1),
        switchMap((jwt) => {
          return next.handle(this._addToken(request, jwt));
        })
      );
    }
  }
}

