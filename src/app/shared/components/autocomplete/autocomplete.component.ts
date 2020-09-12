import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { startWith, map } from 'rxjs/operators';


import { FormControl } from '@angular/forms';

interface option {
  name: string
  type: string
}

@Component({
  selector: 'warrant-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss']
})
export class AutocompleteComponent {
  filteredData: Observable<Array<option>>;

  searchControl = new FormControl();
  connections: Array<option> = [
    { name: 'Decrease', type: 'sql' },
    { name: 'Transit', type: 'mssql' }
  ]

  constructor() {
    this.filteredData = this.searchControl.valueChanges
      .pipe(
        startWith(''),
        map(connection => connection ? this._filterconnections(connection) : this.connections.slice())
      );
  }

  private _filterconnections(value: string): Array<option> {
    const filterValue = value.toLowerCase();
    console.log(filterValue)
    return this.connections.filter(connection => connection.name.toLowerCase().indexOf(filterValue) === 0);
  }
}

