import { Injectable } from '@angular/core';

interface Condition {
  key: string;
  operator: string;
  value: string;
}

class FIELDS {
  static TABLE = '[TABLE]';
  static COLUMNS = '[COLUMNS]';
  static VALUES = '[VALUES]';
  static CONDITIONS = '[CONDITIONS]';
  static ALTERNATIVES = '[ALTERNATIVES]';
  static DATABASE = '[DATABASE]';
}

@Injectable({
  providedIn: 'root'
})
export class QueryBuilder {

  private columns: Array<string> = [];
  private values: Array<string> = [];
  private conditions: Array<string> = [];

  queries = {
    mysql: {
      select: `SELECT ${FIELDS.COLUMNS} FROM ${FIELDS.TABLE}`,
      insert: `INSERT INTO ${FIELDS.TABLE} (${FIELDS.COLUMNS}) VALUES (${FIELDS.VALUES})`,
      tables: `SELECT table_name FROM information_schema.tables WHERE table_schema = '${FIELDS.DATABASE}';`,
      databases: `SHOW DATABASES WHERE \`Database\` NOT LIKE 'information_schema';`,
      conditions: `WHERE ${FIELDS.CONDITIONS}`,
      alternativeQueries: {
        update: `UPDATE ${FIELDS.TABLE} SET ${FIELDS.ALTERNATIVES}`
      }
    },
    sql: {
      databases: `SELECT name FROM sys.databases where owner_sid > 1`,
    }
  };

  get(
    type: string,
    table: string,
    columns: Array<string> = [],
    values: Array<string> = [],
    conditions: Array<string> = []
  ): string {
    let query = this.getQuery(type, 'select')
      .replace(FIELDS.TABLE, table)
      .replace(FIELDS.COLUMNS, columns.join(' ,') || '*')
      .replace(FIELDS.VALUES, values.join(' ,'));

    if (conditions.length > 0) {
      query = query.replace(FIELDS.CONDITIONS, conditions.join(' AND '));
    }

    return query;
  }

  private getQuery(type: string, action: string): string {
    return [this.queries[type][action] ?? this.queries[type].alternativeQueries[action]].toString();
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
      .replace(FIELDS.TABLE, table);

    let valueSet = '';
    switch (action) {
      case 'update': {
        valueSet = columns.map((column: string, index: number) => column = `${column}=${values[index]}`).join(',');
        query = query.replace(FIELDS.ALTERNATIVES, valueSet);
      }
    }

    return query;
  }

  public getTables(type: string, database: string): string {
    return this.getQuery(type, 'tables').replace(FIELDS.DATABASE, database);
  }

  public getDatabases(type: string): string {
    return this.getQuery(type, 'databases');
  }
}
