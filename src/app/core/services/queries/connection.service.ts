import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ProcessService } from '../process.service';

import { ConnectionConfig } from '../../interfaces/connection-config.interface';
import { QueryResults } from '../../interfaces/query-results.interface';
import { QueryBuilder } from '../../constants/queries';
import { map, take } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ConnectionService {

  // connections: Array<ConnectionConfig> = [];
  connections: Array<{
    config: ConnectionConfig,
    connection: any,
    databases: Array<{name: string, tables: Array<string>}>
  }> = [];

  public activeConfiguration: ConnectionConfig;
  library: any;

  connection: any;

  constructor(
    public processService: ProcessService,
    public queryBuilder: QueryBuilder
  ) {
    this.getConnections();
  }

  clear(): void {
    window.localStorage.removeItem('connections');
  }

  getConnections(): void {
    const connections = Array.from(JSON.parse(window.localStorage.getItem('connections')));

    connections.forEach((config: ConnectionConfig) => {
      this.connect(config, (connection) => {
        this.getDatabases(connection, config.type).subscribe((databaseNames: Array<string>) => {
          databaseNames.forEach(database => {
            const databases: Array<any> = [];

            this.getTables(connection, config.type, database).subscribe((tables: Array<string>) => {
              databases.push({ name: database, tables });
            });

            this.connections.push({
              config,
              connection,
              databases
            });
          });
        });
      });
    });
  }

  getDatabases(connection: any, configType: string): Observable<any> {
    return this.query(connection, this.queryBuilder.getDatabases(configType))
      .pipe(
        take(1),
        map(({results}) => {
          return results.map(r => r.Database);
        })
      );
  }

  getTables(connection: any, configType: string, database: string): Observable<any> {
    return this.query(connection, this.queryBuilder.getTables(configType, database)).pipe(map(({ results }) => {
      return results.map(r => r.table_name);
    }));
  }

  getConnection(host: string, type: string): any {
    return this.connections.find(c => c.config.host === host && c.config.type === type);
  }

  connect(connection: ConnectionConfig, onResult: (isConnected: Observable<any>) => void): void {
    this.activeConfiguration = connection;
    return onResult(this[connection.type]());
  }

  saveConnection(connection: ConnectionConfig): void {
    this.getConnections();

    const connections = [
      ...this.connections.filter(c => c.config.host !== connection.host).map(c => c.config),
      connection
    ];

    window.localStorage.setItem('connections', JSON.stringify(connections));
    this.getConnections();
  }

  mysql(): any {
    const library = this.processService.findProcess('mysql');
    return library.instance.createConnection(this.activeConfiguration);
  }

  query(connection: any, query: string): Observable<QueryResults> {
    return new Observable(observer => {
      connection.query(query, (errors: any, results: Array<any>, fields: Array<any>) => {
        if (errors) {
          return observer.error(errors);
        }

        return observer.next({
          results,
          name: fields[0].table,
          fields: fields.map(f => f.name),
        });
      });
    });
  }
}
