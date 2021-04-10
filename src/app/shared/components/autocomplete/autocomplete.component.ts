import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { startWith, map } from 'rxjs/operators';


import { FormControl } from '@angular/forms';
import { ConnectionService, SomeDatabaseCollection } from 'src/app/core/services/queries/connection.service';

export interface Option {
  name: string;
  type: string;
}

@Component({
  selector: 'warrant-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss']
})
export class AutocompleteComponent {
  filteredData: Observable<Array<Option>>;
  connections: Array<SomeDatabaseCollection> = [];

  searchControl = new FormControl();
  // connections: Array<Option> = [
  //   { name: 'Decrease', type: 'sql' },
  //   { name: 'Transit', type: 'mssql' }
  // ]

  constructor(private connectionsService: ConnectionService) {
    this.filteredData = this.searchControl.valueChanges
      .pipe(
        startWith(''),
        map(connection => connection ? this._filterconnections(connection) : this.connections.slice())
    );
    
    this.connectionsService.getConnections().subscribe(c => {
      this.connections = c;
    })
  }

  private _filterconnections(value: string): Array<Option> {
    const filterValue = value.toLowerCase();
    const databases = this.connections.filter(c => c.databases.some(d => d.name.toLowerCase().includes(value.toLowerCase()))).map(c => c.databases.map(d => ({name: d.name, type: c.config.type})));
    console.log(databases);
    
    // const tables = this.connections.filter(c => c.databases.some(d => d.tables.some(t => t.toLowerCase().includes(value.toLowerCase()))));
    const tables = this.connections.filter(c => c.databases.some(d => d.tables.filter(t => t.toLowerCase().includes(t.toLowerCase()))));
    console.log(tables)
    
    return [];
    return this.connections.filter(connection => connection.name.toLowerCase().indexOf(filterValue) === 0);
  }

  // private calculate(value: string, compare: string): void {
  //   return value.
  // }
}

