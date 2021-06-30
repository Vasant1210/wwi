import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class NotificationSocketService extends Socket{
  constructor() {
    super({ url: 'http://127.0.0.1:3000', options: { withCredentials: true, "transports": ["websocket"] } });
  }
}
