import { Component, HostListener, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';

import { StoreConnectionDialogComponent } from '../shared/components/dialog/store-connection-dialog/store-connection-dialog.component';

import { ConnectionConfig } from '../core/interfaces/connection-config.interface';
import { ConnectionService } from '../core/services/connection.service';
import { ContextMenu } from '../core/classes/context-menu.class';

import { ADD, EDIT } from '../core/constants/types';
import { ProcessService } from '../core/services/process.service';
import { TranslatePipe } from '@ngx-translate/core';
import { Search } from '../core/classes/search.class';
import { AutocompleteComponent } from '../shared/components/autocomplete/autocomplete.component';


@Component({
  selector: 'app-database',
  templateUrl: './database.component.html',
  styleUrls: ['./database.component.scss']
})
export class DatabaseComponent implements OnInit {

  dataSource = [
    { id: 1, name: 'Frits', email: 'Frits@mail.com', enabled: true },
    { id: 2, name: 'John', email: 'John@mail.com', enabled: true },
    { id: 3, name: 'Mike', email: 'Mike@mail.com', enabled: true },
    { id: 4, name: 'Paul', email: 'Paul@mail.com', enabled: true },
    { id: 5, name: 'Mitch', email: 'Mitch@mail.com', enabled: true },
    { id: 6, name: 'Marcel', email: 'Marcel@mail.com', enabled: true },
  ];

  displayedColumns: string[] = [
    'id',
    'name',
    'email',
    'enabled'
  ];

  connections: Array<ConnectionConfig> = [];

  constructor(
    public dialog: MatDialog,
    private processService: ProcessService,
    private connectionService: ConnectionService,
    private contextMenu: ContextMenu,
    private translatePipe: TranslatePipe,
  ) {
    if (this.processService.isElectron) {
      this.connections = this.connectionService.getConnections();
    }
  }

  ngOnInit(): void { }


  openContextMenu($event: MouseEvent, connection?: ConnectionConfig): void {
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

  openStoreConnectionDialog(configuration?: ConnectionConfig): void {
    this.dialog.open(StoreConnectionDialogComponent, {
      data: {
        configuration
      }
    });
  }

  getDatabases(): void {
    this.connectionService.connect(this.connectionService.getConnection('localhost', 'mysql'), this.connected);
  }

  @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent): void {
    if (event.ctrlKey && event.key === 'p') {
      if (this.dialog.openDialogs) {
        this.dialog.openDialogs.forEach(dialog => dialog.close());
      }
      this.dialog.open(AutocompleteComponent);
    }
  }

  connected = (connection: Observable<any>) => {
    connection.subscribe(con => {
      console.log(' orange s');
      console.log(con);
    });
  }
}
