import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { SnackbarComponent } from '../../shared/components/notification/snackbar/snackbar.component';

@Injectable({
  providedIn: 'root'
})
export class Notification {
  constructor(
    private snackBar: MatSnackBar
  ) {}

  succes(message: string): void {
    this.showMessage(message);
  }

  error(message: string): void {
    this.showMessage(message, false)
  }

  text(message: string): void {
    this.snackBar.openFromComponent(SnackbarComponent, {
      data: {
        message
      },
      panelClass: 'dec-notification',
      duration: 5000
    })
  }

  showMessage(message: string, success = true): void {
    this.snackBar.openFromComponent(SnackbarComponent, {
      data: {
        message,
        success
      },
      panelClass: 'dec-notification',
      duration: 5000
    });
  }
}