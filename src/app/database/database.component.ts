import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';

import { AutocompleteComponent } from '../shared/components/autocomplete/autocomplete.component';
import { StoreConnectionDialogComponent } from '../shared/components/dialog/store-connection-dialog/store-connection-dialog.component';

import { ConnectionConfig } from '../core/interfaces/connection-config.interface';
import { ConnectionService } from '../core/services/connection.service';
import { ContextMenu } from '../core/classes/context-menu.class';
import { Search } from '../core/classes/search.class';
import { TranslatePipe } from '@ngx-translate/core';

import { ADD, EDIT } from '../core/constants/types';
import { ElectronService } from '../core/services/electron.service';


@Component({
  selector: 'app-database',
  templateUrl: './database.component.html',
  styleUrls: ['./database.component.scss']
})
export class DatabaseComponent implements OnInit  {

  columns: any[] = [
    { field: 'position', width: 100 },
    { field: 'name', width: 350, },
    { field: 'weight', width: 250, },
    { field: 'symbol', width: 100, }
  ];

  displayedColumns: string[] = this.columns.map(c => c.field);
  connections: Array<ConnectionConfig> = [];

  constructor(
    public dialog: MatDialog,
    private electronService: ElectronService,
    private connectionService: ConnectionService,
    private contextMenu: ContextMenu,
    private translatePipe: TranslatePipe,
    private search: Search
  ) {

    if (this.electronService.isElectron) {
      this.connections = this.connectionService.getConnections();
    }
  }

  ngOnInit(): void { }

  openTest(...args: Array<any>) {
    // console.log(args)
  }

  openContextMenu($event: MouseEvent, connection?: ConnectionConfig) {
    this.contextMenu.show({
      top: $event.clientY,
      left: $event.clientX,
      options: [
        {
          type: ADD,
          label: this.translatePipe.transform('Connection.Add'), 
          method: (...args: Array<any>) => this.openStoreConnectionDialog()
         },
        {
          type: EDIT,
          label: this.translatePipe.transform('Connection.Edit'), 
          method: () => this.openStoreConnectionDialog(connection)
        }
      ].filter(option => connection == null ? option.type !== EDIT : option)
    });
  }

  openAutocompleteDialog() {
    this.dialog.open(AutocompleteComponent, {
      panelClass: 'decrease-autocomplete',
      width: '800px'
    });
  }

  openStoreConnectionDialog(configuration: ConnectionConfig = null) {
    this.dialog.open(StoreConnectionDialogComponent, {
      data: {
        configuration: configuration
      },
      width: '525px',
      height: '590px',
      panelClass: 'decrease-panel'
    });
  }

  getDatabases() {
    console.log(this.connectionService.getConnection('mysql', 'mysql'))
    this.connectionService.connect(this.connectionService.getConnection('localhost', 'mysql'), this.connected)
  }

  connected = (connection: Observable<any>) => {
    connection.subscribe(con => {
      console.log(' orange s')
      console.log(con);
      con.query(`show databases;`, (err, res, fields) => {
        console.log(err);
        console.log(res);
        console.log(fields);
      })
    })
  }
}
