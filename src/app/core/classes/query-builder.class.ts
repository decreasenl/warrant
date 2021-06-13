import { Injectable } from '@angular/core';
import { Queries } from '../constants/queries.class';

@Injectable({ providedIn: 'root' })
export class QueryBuilder {

  /*
    const test = this.queryBuilder.set(this.connectionService.activeConfiguration.type,
      'update', 'users', ['id', 'email'], ['test@example.com', 5]
    );
    */
  
  get(
    type: string,
    table: string,
    columns: Array<string> = [],
    values: Array<string> = [],
    conditions: Array<string> = []
  ): string {
    let query = this.getQuery(type, 'select')
      .replace(Queries.TABLE, table)
      .replace(Queries.COLUMNS, columns.join(' ,') || '*')
      .replace(Queries.VALUES, values.join(' ,'));

    if (conditions.length > 0) {
      query = query.replace(Queries.CONDITIONS, conditions.join(' AND '));
    }

    return query;
  }

  private getQuery(type: string, action: string): string {
    return [Queries.QUERIES[type][action] ?? Queries.QUERIES[type].alternativeQueries[action]].toString();
  }

  set(
    type: string,
    action: 'update' | 'delete' | 'insert',
    table: string,
    columns: Array<string> = [],
    values: Array<any> = [],
    conditions: Array<any> = []
  ): string {

    let query = this.getQuery(type, action)
      .replace(Queries.TABLE, table);

    let valueSet = '';
    switch (action) {
      case 'update': {
        valueSet = columns.map((column: string, index: number) => column = `${column}=${values[index]}`).join(',');
        query = query.replace(Queries.ALTERNATIVES, valueSet);
      }
    }

    return query;
  }

  public getTables(type: string, database: string): string {
    return this.getQuery(type, 'tables').replace(Queries.DATABASE, database);
  }

  public getDatabases(type: string): string {
    return this.getQuery(type, 'databases');
  }
}
