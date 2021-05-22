import { Component, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';

import { startWith, map } from 'rxjs/operators';

import { FormControl } from '@angular/forms';
import { ConnectionService, SomeDatabaseCollection } from 'src/app/core/services/queries/connection.service';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { MatDialogRef } from '@angular/material/dialog';

export interface Option {
  host: string;
  database: string;
  tableName: string;

  name: string;
  type: string;
}

@Component({
  selector: 'warrant-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss']
})
export class AutocompleteComponent {
  selectedOption: Option = null;
  options: Observable<Array<Option>>;
  connections: Array<SomeDatabaseCollection> = [];

  @ViewChild('auto', { static: true }) auto: MatAutocomplete;

  searchControl = new FormControl();

  constructor(private connectionsService: ConnectionService, private dialogRef: MatDialogRef<AutocompleteComponent>) {
    this.options = this.searchControl.valueChanges
      .pipe(
        startWith(''),
        map(connection => this._filterconnections(connection))
      );

    this.connectionsService.getConnections().subscribe(c => {
      this.connections = c;
    });
  }

  private _filterconnections(value: string): Array<Option> {
    if (typeof value !== 'string') {
      return [];
    }

    const filterValue = value.toLowerCase();
    const matchingDatabaseConnections = this.connections.slice().filter(c =>
      c.databases.some(d => d.name.toLowerCase().includes(filterValue)) || c.databases.some(d => d.tables.includes(filterValue) || d.tables.find(t => t.includes(filterValue)))
    );

    const databases = this.flattenArray(matchingDatabaseConnections.filter(c => c.databases.some(d => d.name.toLowerCase().includes(filterValue))).map(c => c.databases.map(d => ({ name: d.name, type: c.config.type }))));
    const tables = this.flattenArray(matchingDatabaseConnections.slice().map(c => c.databases.map(d => d.tables))).filter(t => t.includes(filterValue)).map(table => ({ name: table, type: 'table' }));

    return [
      ...databases,
      ...tables
    ];
  }

  private flattenArray(array: Array<any>): Array<any> {
    if (array.length) {
      return [].concat.apply([], array.reduce((prev, next) => prev.concat(next)));
    }
    return [];
  }

  public displayOption(option: Option): string {
    if (option) {
      return option.name;
    }
    return '';
  }

  public selectItem(option: Option): void {
    this.selectedOption = option;
    this.dialogRef.close(option);
  }
}

