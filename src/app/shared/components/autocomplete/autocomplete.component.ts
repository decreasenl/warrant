import { Component } from '@angular/core';
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

  constructor(private connectionsService: ConnectionService) {
    this.filteredData = this.searchControl.valueChanges
      .pipe(
        startWith(''),
        map(connection => this._filterconnections(connection))
    );

    this.connectionsService.getConnections().subscribe(c => {
      this.connections = c;
    });
  }

  private _filterconnections(value: string): Array<Option> {
    const filterValue = value.toLowerCase();
    const matchingDatabases = this.connections.slice().filter(c =>
      c.databases.some(d => d.name.toLowerCase().includes(filterValue)) || c.databases.some(d => d.tables.includes(filterValue) || d.tables.find(t => t.includes(filterValue)))
    );

    const databases = this.flattenArray(matchingDatabases.map(c => c.databases.map(d => ({name: d.name, type: c.config.type}))));
    const tables = this.flattenArray(matchingDatabases.map(c => c.databases.map(d => d.tables))).filter(t => t.includes(filterValue)).map(table => ({name: table, type: 'table'}));

    return [
      ...databases,
      ...tables
    ];
  }

  private flattenArray(array: Array<any>): Array<any> {
    return [].concat.apply([], array.reduce((prev, next) => prev.concat(next)));;
  }
}

