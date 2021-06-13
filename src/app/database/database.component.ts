import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';
import { MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import { of } from 'rxjs';

import { QueryBuilder } from '../core/classes/query-builder.class';
import { ContextMenu } from '../core/classes/context-menu.class';
import { ADD, EDIT } from '../core/constants/types';
import { ConnectionConfig } from '../core/interfaces/connection-config.interface';
import { ConnectionService, SomeDatabaseCollection } from '../core/services/queries/connection.service';

import { StoreConnectionDialogComponent } from '../shared/components/dialog/store-connection-dialog/store-connection-dialog.component';
import { AutocompleteComponent, Option } from '../shared/components/autocomplete/autocomplete.component';

@Component({
  selector: 'app-database',
  templateUrl: './database.component.html',
  styleUrls: ['./database.component.scss']
})
export class DatabaseComponent implements OnInit {

  @ViewChild('tabs', { static: true }) tabs: MatTabGroup;

  connections: Array<SomeDatabaseCollection>;
  activeDataSource = null;

  dataSources: Array<{
    database: string,
    selectedTabIndex: number
    tables: Array<
      {
        table: string,
        columns: Array<string>,
        results: Array<any>,
      }>
  }> = [];

  openedDatabases = [];

  constructor(
    public dialog: MatDialog,
    private contextMenu: ContextMenu,
    private translatePipe: TranslatePipe,
    private queryBuilder: QueryBuilder,
    public connectionService: ConnectionService,
  ) { }

  public ngOnInit(): void {
    this.connectionService.getConnections().subscribe((connections: Array<SomeDatabaseCollection>) => {
      this.connections = connections;
    });
  }

  public openConnectionContextMenu($event: MouseEvent, connection?: ConnectionConfig): void {
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

  public openTableContextMenu($event: MouseEvent, table?: string): void {
    console.log('FIRED');
    console.log(table)
    this.contextMenu.show({
      top: $event.clientY,
      left: $event.clientX,
      options: [
        {
          type: 'Close all',
          label: this.translatePipe.transform('Tabs.Close'),
          method: (...args: Array<any>) => console.log('supposed to close all tables')
        }
      ]
    });
  }

  public openStoreConnectionDialog(configuration?: any): void {
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
      this.dialog.open(AutocompleteComponent).afterClosed().subscribe((option: Option) => {
        if (option) {
          switch (option.type) {
            case 'mysql':
              this.openedDatabases.push(option.name);
              break;
            case 'table':

              const tableConnection = this.connections.find(c => c.databases.some(d => d.tables.find(t => t === option.name)));
              if (tableConnection) {
                const database = tableConnection.databases.find(d => d.tables.find(t => t === option.name));

                if (!this.openedDatabases.includes(database.name)) {
                  this.openedDatabases.push(database.name);
                }

                this.openTable(tableConnection.config.host, database.name, option.name);
              }
              break;
          }
        }
      });
    }
  }

  public OnDataChanged($event): void {
    console.log($event);
  }

  public openTable(host: string, database: string, tableName: string): void {
    const existingDatabase = this.dataSources.find(d => d.database === database);
    if (this.dataSources.find(d => d.database) && this.dataSources.find(d => d.tables.find(t => t.table === tableName))) {
      existingDatabase.tables = existingDatabase.tables.filter(t => t.table !== tableName);
    }

    const connection = this.connections.find(c => c.config.host === host && c.databases.find(d => d.tables.includes(tableName)));
    const query = this.queryBuilder.get(connection.config.type, tableName);
    this.connectionService.query(connection.connection, query)
      .subscribe(results => {
        if (!existingDatabase) {
          const newDataSource = {
            database,
            selectedTabIndex: 0,
            tables: [{
              table: tableName,
              columns: results.fields,
              results: results.results,
            }],
          };

          this.dataSources.push(newDataSource);
        } else {
          existingDatabase.tables.push({
            table: tableName,
            columns: results.fields,
            results: results.results
          });
          existingDatabase.selectedTabIndex = existingDatabase.tables.length - 1;
        }

        this.activeDataSource = this.dataSources.find(d => d.database === database);
      }, errors => {

      });
  }

  public selectTab(dataSource: any, $event?: MatTabChangeEvent): void {
    console.log(dataSource, $event)
  }
}
