import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ConnectionService } from '../../../../core/services/connection.service';
import { ConnectionConfig } from '../../../../core/interfaces/connection-config.interface';

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
      configuration?: ConnectionConfig
    }
  ) { }

  ngOnInit(): void {
    if (this.data.configuration) {
      const existingConnection = this.connectionService.getConnections().find(c => c.database !== this.data.configuration.database);
      if (existingConnection) {
        this.notification.error('This connection is invalid.');
        return;
      }
    }

    this.connectionForm = new FormGroup({
      'host': new FormControl(this.data.configuration ? this.data.configuration.host : '', Validators.required),
      'user': new FormControl(this.data.configuration ? this.data.configuration.user : '', Validators.required),
      'password': new FormControl(this.data.configuration ? this.data.configuration.password : '', Validators.required),
      'database': new FormControl(this.data.configuration ? this.data.configuration.database : '', Validators.required),
      'port': new FormControl(this.data.configuration ? this.data.configuration.port : '', Validators.required),
      'type': new FormControl(this.data.configuration ? this.data.configuration.type : '', Validators.required),
      'tag': new FormControl(this.data.configuration ? this.data.configuration.tag : '', Validators.required)
    })
  }

  saveConnection(): void {
    const connection: ConnectionConfig = this.connectionForm.value;

    if (this.connectionForm.valid) {
      this.connectionService.saveConnection(connection);
      this.notification.succes('Connection was saved');
      this.dialogRef.close();
    }
  }

}
