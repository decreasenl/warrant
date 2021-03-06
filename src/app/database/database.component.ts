import { Component, HostListener, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { StoreConnectionDialogComponent } from '../shared/components/dialog/store-connection-dialog/store-connection-dialog.component';

import { ConnectionConfig } from '../core/interfaces/connection-config.interface';
import { ContextMenu } from '../core/classes/context-menu.class';

import { ADD, EDIT } from '../core/constants/types';
import { TranslatePipe } from '@ngx-translate/core';
import { AutocompleteComponent } from '../shared/components/autocomplete/autocomplete.component';
import { ConnectionService } from '../core/services/queries/connection.service';
import { QueryBuilder } from '../core/constants/queries';

@Component({
  selector: 'app-database',
  templateUrl: './database.component.html',
  styleUrls: ['./database.component.scss']
})
export class DatabaseComponent implements OnInit {

  connections = [];
  tables: Array<{ database: string, table: string }> = [];

  dataSources: Array<{
    table: string,
    database: string,
    columns: Array<string>,
    results: Array<any>
  }> = [];

  constructor(
    public dialog: MatDialog,
    private contextMenu: ContextMenu,
    private translatePipe: TranslatePipe,
    private queryBuilder: QueryBuilder,
    public connectionService: ConnectionService,
  ) { }

  ngOnInit(): void {
    this.connections = this.connectionService.connections;
  }

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

  openStoreConnectionDialog(configuration?: any): void {
    this.dialog.open(StoreConnectionDialogComponent, {
      data: {
        configuration
      }
    });
  }

  @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent): void {
    if (event.ctrlKey && event.key === 'p') {
      if (this.dialog.openDialogs) {
        this.dialog.openDialogs.forEach(dialog => dialog.close());
      }
      this.dialog.open(AutocompleteComponent);
    }
  }

  OnDataChanged($event): void {
    console.log($event);
  }

  openTable(database: string, tableName: string): void {
    /*
    const test = this.queryBuilder.set(this.connectionService.activeConfiguration.type,
      'update', 'users', ['id', 'email'], ['test@example.com', 5]
    );
    */

    if (this.tables.find(t => t.database === database && t.table === tableName)) {
      this.tables = this.tables.filter(t => t.database !== database && t.table !== tableName);
      this.dataSources = this.dataSources.filter(d => d.database !== database && d.table !== tableName);
    }

    const connection = this.connectionService.connections.find(c => c.config.database === database && c.tables.includes(tableName));
    const query = this.queryBuilder.get(connection.config.type, tableName);
    this.connectionService.query(connection.connection, query)
      .subscribe(results => {
        this.dataSources.push({
          database: connection.config.database,
          table: tableName,
          columns: results.fields,
          results: results.results
        });

        this.tables.push({
          database,
          table: tableName
        });
      }, errors => {

      });
  }
}
