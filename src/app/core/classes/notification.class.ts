import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar'

import { SnackbarComponent } from '../../shared/components/notification/snackbar/snackbar.component';

@Injectable({
  providedIn: 'root'
})
export class Notification {
  constructor(
    private snackBar: MatSnackBar
  ) {}
  
  succes(message: string) {
    this.showMessage(message);
  }

  error(message: string) {
    this.showMessage(message, false)
  }

  text(message: string) {
    this.snackBar.openFromComponent(SnackbarComponent, {
      data: {
        message: message
      },
      panelClass: 'dec-notification'
    })
  }

  showMessage(message: string, success = true) {
    this.snackBar.openFromComponent(SnackbarComponent, {      
      data: {
        message: message,
        success: success
      },
      panelClass: 'dec-notification'
    })
  }
}