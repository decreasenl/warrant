import { Injectable } from '@angular/core';
import { Observable, of, Subscription } from 'rxjs';

import { ProcessService } from '../process.service';

import { ConnectionConfig } from '../../interfaces/connection-config.interface';
import { QueryResults } from '../../interfaces/query-results.interface';
import { map, take } from 'rxjs/operators';
import { QueryBuilder } from '../../classes/query-builder.class';
import { ThrowStmt } from '@angular/compiler';

export interface SomeDatabaseCollection {
  config: ConnectionConfig;
  connection: any;
  databases: Array<{ name: string, tables: Array<string> }>;
}
@Injectable({
  providedIn: 'root'
})
export class ConnectionService {

  private connections: Array<{
    config: ConnectionConfig,
    connection: any,
    databases: Array<{name: string, tables: Array<string>}>
  }> = [];

  private connectedConnections: Observable<Array<SomeDatabaseCollection>> = of(this.connections);
  
  public activeConfiguration: ConnectionConfig;
  library: any;

  connection: any;

  constructor(
    public processService: ProcessService,
    public queryBuilder: QueryBuilder
  ) {
    this.createConnections();
  }

  public clear(): void {
    window.localStorage.removeItem('connections');
  }

  public getConnections(): Observable<Array<SomeDatabaseCollection>> {
    return this.connectedConnections;
  }

  public createConnections(): void{
    if (!window.localStorage.getItem('connections')) {
      this.setConnections([]);
    }
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

  public getDatabases(connection: any, configType: string): Observable<any> {
    return this.query(connection, this.queryBuilder.getDatabases(configType))
      .pipe(
        take(1),
        map(({ results }) => {
          return results.map(r => r.Database);
        })
      );
  }

  public getTables(connection: any, configType: string, database: string): Observable<any> {
    return this.query(connection, this.queryBuilder.getTables(configType, database)).pipe(map(({ results }) => {
      return results.map(r => r.table_name);
    }));
  }

  public getConnection(host: string, type: string): any {
    return this.connections.find(c => c.config.host === host && c.config.type === type);
  }

  private connect(connection: ConnectionConfig, onResult: (isConnected: Observable<any>) => void): void {
    this.activeConfiguration = connection;
    return onResult(this[connection.type]());
  }

  public saveConnection(connection: ConnectionConfig): void {
    this.createConnections(); // Is this required?
    const connections = [
      ...this.connections.filter(c => `${c.config.host}:${c.config.port}` !== `${connection.host}:${connection.port}`).map(c => c.config),
      connection
    ];

    this.setConnections(connections);
    this.createConnections(); // Is this required?
  }

  private mysql(): any {
    const library = this.processService.findProcess('mysql');
    return library.instance.createConnection(this.activeConfiguration);
  }

  public query(connection: any, query: string): Observable<QueryResults> {
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

  private setConnections(connections: Array<any>): void {
    window.localStorage.setItem('connections', JSON.stringify(connections));
  }
}
