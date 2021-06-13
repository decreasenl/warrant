import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Queries {

  static TABLE = '[TABLE]';
  static COLUMNS = '[COLUMNS]';
  static VALUES = '[VALUES]';
  static CONDITIONS = '[CONDITIONS]';
  static ALTERNATIVES = '[ALTERNATIVES]';
  static DATABASE = '[DATABASE]';

  static QUERIES = {
    mysql: {
      select: `SELECT ${Queries.COLUMNS} FROM ${Queries.TABLE}`,
      insert: `INSERT INTO ${Queries.TABLE} (${Queries.COLUMNS}) VALUES (${Queries.VALUES})`,
      tables: `SELECT table_name FROM information_schema.tables WHERE table_schema = '${Queries.DATABASE}';`,
      databases: `SHOW DATABASES WHERE \`Database\` NOT LIKE 'information_schema';`,
      conditions: `WHERE ${Queries.CONDITIONS}`,
      alternativeQueries: {
        update: `UPDATE ${Queries.TABLE} SET ${Queries.ALTERNATIVES}`
      }
    },
    sql: {
      databases: `SELECT name FROM sys.databases where owner_sid > 1`,
    }
  };
}
