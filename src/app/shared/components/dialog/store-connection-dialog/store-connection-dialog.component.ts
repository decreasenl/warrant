import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ConnectionService } from '../../../../core/services/queries/connection.service';
import { ConnectionConfig } from '../../../../core/interfaces/connection-config.interface';
import { Notification } from '../../../../core/classes/notification.class';
import { ThrowStmt } from '@angular/compiler';

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
  ];

  constructor(
    public dialogRef: MatDialogRef<StoreConnectionDialogComponent>,
    public connectionService: ConnectionService,
    private notification: Notification,
    @Inject(MAT_DIALOG_DATA) public data: {
      configuration?: any
    }
  ) { }

  ngOnInit(): void {
    this.connectionForm = new FormGroup({
      'host': new FormControl(this.hasConfiguration() ? this.data.configuration.config.host : '', Validators.required),
      'user': new FormControl(this.hasConfiguration() ? this.data.configuration.config.user : '', Validators.required),
      'password': new FormControl(this.hasConfiguration() ? this.data.configuration.config.password : '', Validators.required),
      'database': new FormControl(this.hasConfiguration() ? this.data.configuration.config.database : '', Validators.required),
      'port': new FormControl(this.hasConfiguration() ? this.data.configuration.config.port : '', Validators.required),
      'type': new FormControl(this.hasConfiguration() ? this.data.configuration.config.type : '', Validators.required),
      'tag': new FormControl(this.hasConfiguration() ? this.data.configuration.config.tag : '', Validators.required)
    });

    if (this.hasConfiguration()) {
      this.connectionService.getConnections().subscribe(connections => {
        const existingConnection = connections.find(c => `${c.config.host}:${c.config.port}` === `${this.data.configuration.config.port}:${this.data.configuration.config.port}`);
        if (existingConnection) {
          this.notification.error('This connection is invalid.');
          this.dialogRef.close();
          return;
        }
      });
    }

  }

  saveConnection(): void {
    const connection: ConnectionConfig = this.connectionForm.value;

    if (this.connectionForm.valid) {
      this.connectionService.saveConnection(connection);
      this.notification.succes('Connection was saved');
      this.dialogRef.close();
    }
  }

  hasConfiguration(): boolean {
    return this.data.configuration && this.data.configuration.config;
  }
}
