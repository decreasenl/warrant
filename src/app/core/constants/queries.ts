import { CompileSummaryKind } from "@angular/compiler";
import { Injectable } from "@angular/core";

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
      conditions: `WHERE ${FIELDS.CONDITIONS}`,
      alternativeQueries: {
        update: `UPDATE ${FIELDS.TABLE} SET ${FIELDS.ALTERNATIVES}`
      }
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
    values: Array<string> = [],
    conditions: Array<string> = []
  ): string {

    let query = this.getQuery(type, 'select')
      .replace(FIELDS.TABLE, table);
    
    //forEach((column: string, index: number) => valueSet += `${column} = ${values[index]}`)
    var valueSet = '';
    switch (action) {
      case 'update': valueSet = columns.map((column: string, index: number) => column = `${column}=${values[index]}`).join(',');
    }

    console.log(valueSet)

    return query;
  }

}
