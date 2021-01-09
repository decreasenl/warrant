import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { ProcessService } from './process.service';

import { ConnectionConfig } from '../interfaces/connection-config.interface';
import { Connection } from '../interfaces/connection.interface';

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {

  connections: Array<ConnectionConfig> = [];
  activeConfiguration: ConnectionConfig;
  library: any;

  connection: Connection;

  constructor(public processService: ProcessService) {
    if(this.processService.isElectron) {
      
    }
  }

  clear() {
    window.localStorage.removeItem('connections')
  }

  getConnections(): Array<ConnectionConfig> {
    const connections = window.localStorage.getItem('connections');
    return this.connections = connections && connections.length ? JSON.parse(connections) : [];
  }

  getConnection(host: string, type: string) {
    console.log(this.getConnections());
    return this.getConnections().find((c: ConnectionConfig) => c.host === host && c.type === type);
  }

  connect(connection: ConnectionConfig, onResult: (isConnected: Observable<any>) => void) {
    this.activeConfiguration = connection;
    return onResult(this[connection.type]());
  }

  saveConnection(connection: ConnectionConfig): void {
    this.getConnections();

    this.connections = [
      ...this.connections.filter(conn => conn.database !== connection.database), 
      connection
    ]

    window.localStorage.setItem('connections', JSON.stringify(this.connections))
  }

  sql() {
    this.library = this.processService.findProcess('mysql');
  }

  mysql(): Observable<any> {
    const library = this.processService.findProcess('mysql');
    this.connection = library.instance.createConnection(this.activeConfiguration);

    return of(this.connection);
  }
}