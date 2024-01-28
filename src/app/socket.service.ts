import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SocketService {
  constructor(private socket: Socket) {}

  getMessage(name: string): Observable<any> {
    return this.socket.fromEvent(name);
  }

  sendMessage(name: string, payload: any): void {
    this.socket.emit(name, payload);
  }
}
