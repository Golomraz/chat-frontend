import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ILoginResult, IUser } from './auth.interface';
import { catchError, firstValueFrom, of, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {}

  private _currentUser: any;

  get user() {
    return this._currentUser;
  }

  getCurrentUser() {
    if (this._currentUser) return this._currentUser;

    return firstValueFrom(this.http.get('users/me')) ;
  }

  signUp(data: IUser) {
    this.http.post('auth/signup', data).subscribe(() => this.signIn(data));
  }

  signIn(data: IUser) {
    this.http.post<ILoginResult>('auth/signin', data).subscribe((res) => {
      console.error(res);
      localStorage.setItem('accessToken', res.accessToken);
      localStorage.setItem('refreshToken', res.refreshToken);

      this._currentUser = {
        username: res.username,
        id: res.id,
      };
      this.router.navigate(['home']);
    });
  }

  logOut() {
    this.http.get('auth/logout').subscribe(() => {
      localStorage.clear();
      this.router.navigate(['/']);
    });
  }

  refreshToken() {
    return this.http.get<ILoginResult>('auth/refresh').pipe(
      tap((res) => {
        localStorage.setItem('accessToken', res.accessToken);
        localStorage.setItem('refreshToken', res.refreshToken);
      }),
      catchError(() => {
        localStorage.clear();
        this.router.navigate(['/']);
        return of(false);
      })
    );
  }
}
