import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, firstValueFrom, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RoomsService {
  constructor(private http: HttpClient) {}

  findUser(letter: string): Observable<any> {
    return this.http.get(`users/${letter}`);
  }

  createRoom(users: string): Observable<any> {
    return this.http.post('rooms', { users: users });
  }

  getRoom(id: string) {
    return firstValueFrom(this.http.get(`rooms/${id}`));
  }
}
