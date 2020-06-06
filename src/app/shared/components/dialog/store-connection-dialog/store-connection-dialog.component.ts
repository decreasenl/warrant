import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl } from '@angular/forms';

import { ConnectionService } from '../../../../core/services/connection.service';
import { Connection } from '../../../../core/interfaces/connection.interface';
import { Notification } from '../../../../core/classes/notification.class';
@Component({
  selector: 'warrant-dialog',
  templateUrl: './store-connection-dialog.component.html',
  styleUrls: ['./store-connection-dialog.component.scss']
})
export class StoreConnectionDialogComponent implements OnInit {

  connectionForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<StoreConnectionDialogComponent>,
    public connectionService: ConnectionService,
    private notification: Notification,
    @Inject(MAT_DIALOG_DATA) public data: {
      connection?: Connection
    }
  ) { }

  ngOnInit(): void {
    if (this.data.connection) {
      const invalidConnection = this.connectionService.getConnections().find(c => c.database !== this.data.connection.database);
      if (invalidConnection) {
        this.notification.error('This connection is invalid.');
        return;
      }
    }

    this.connectionForm = new FormGroup({
      'host': new FormControl(),
      'user': new FormControl(),
      'password': new FormControl(),
      'database': new FormControl(),
      'port': new FormControl(),
      'type': new FormControl(),
      'tag': new FormControl()
    })
  }

  saveConnection() {
    // const existingConnection = this.connectionService.getConnections().find(c => c.database === )
    
    this.notification.succes('Connection was saved');
  }

}
