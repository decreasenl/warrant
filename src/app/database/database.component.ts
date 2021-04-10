import { AfterContentInit, Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';
import { MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';

import { StoreConnectionDialogComponent } from '../shared/components/dialog/store-connection-dialog/store-connection-dialog.component';

import { ConnectionConfig } from '../core/interfaces/connection-config.interface';
import { ContextMenu } from '../core/classes/context-menu.class';
import { ADD, EDIT } from '../core/constants/types';
import { AutocompleteComponent } from '../shared/components/autocomplete/autocomplete.component';
import { ConnectionService, SomeDatabaseCollection } from '../core/services/queries/connection.service';
import { QueryBuilder } from '../core/classes/query-builder.class';
import { of } from 'rxjs';


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

    of(this.dataSources).subscribe(a => {console.log(a)});
  }

  public openContextMenu($event: MouseEvent, connection?: ConnectionConfig): void {
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
      this.dialog.open(AutocompleteComponent);
    }
  }

  public OnDataChanged($event): void {
    console.log($event);
    // persist changes to the database
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
    // console.log(dataSource, $event)
  }
}
