import { Injectable } from '@angular/core';

import { Notification } from 'electron';
import { ISystemNotification } from '../interfaces/system-notification.interface'

@Injectable({
  providedIn: 'root'
})
export class SystemNotification { 

  notification: Notification = new Notification();
  
  constructor() { }

  public show(systemNotification: ISystemNotification): void {
    this.notification.title = systemNotification.title;
    this.notification.body = systemNotification.body;
    this.notification.show();
  }
}