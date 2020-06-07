import { Injectable } from '@angular/core';
import { Connection } from '../interfaces/connection.interface';
import { ElectronService } from './electron.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {

  connections: Array<Connection> = [];
  activeConnection: Connection;
  connection: Observable<any>;
  library: any;

  constructor(public electronService: ElectronService) {
    if(this.electronService.isElectron) {
      
    }	
  }

  getConnections(): Array<Connection> {
    const connections = window.localStorage.getItem('connections');
    return this.connection = connections && connections.length ? JSON.parse(connections) : [];
  }

  connect(connection: Connection, onResult = Function) {
    this.activeConnection = connection;

    return onResult(this[connection.type]());
  }

  saveConnection(connection: Connection): Array<Connection> {
    this.getConnections();

    this.connections = [
      ...this.connections.filter(conn => conn.database !== connection.database), 
      connection
    ]

    window.localStorage.setItem('connections', JSON.stringify(this.connections))

    return this.getConnections();
  }

  sql() {
    this.library = this.electronService.findProcess('mysql');
  }

  mysql(): Observable<any> {
    const library = this.electronService.findProcess('mysql');

    return new Observable(observer => {
      const connection = library.createConnection(this.activeConnection);

      connection.connect((error) => {
        if(error) {
          console.error(error)
        }
        console.log(connection);
        observer.next(connection);
      });
    })
  }
}