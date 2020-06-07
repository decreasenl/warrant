import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';

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

  connectionTypes: Array<string> = [
    'mysql',
    'msql'
  ]

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
      'host': new FormControl(this.data.connection ? this.data.connection.host : '', Validators.required),
      'username': new FormControl(this.data.connection ? this.data.connection.user : '', Validators.required),
      'password': new FormControl(this.data.connection ? this.data.connection.password : '', Validators.required),
      'database': new FormControl(this.data.connection ? this.data.connection.database : '', Validators.required),
      'port': new FormControl(this.data.connection ? this.data.connection.port : '', Validators.required),
      'type': new FormControl(this.data.connection ? this.data.connection.type : '', Validators.required),
      'tag': new FormControl(this.data.connection ? this.data.connection.tag : '', Validators.required)
    })
  }

  saveConnection() {
    const connection: Connection = this.connectionForm.value;
    
    if (this.connectionForm.valid) {
      this.connectionService.saveConnection(connection);
      this.notification.succes('Connection was saved');
    }
  }

}
