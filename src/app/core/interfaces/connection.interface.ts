import { ConnectionConfig } from './connection-config.interface';

export interface Connection {
  config: ConnectionConfig;
  connection: any;
  databases: Array<{ name: string, tables: Array<string> }>;
}
