export interface ConnectionConfig {
  host: string;
  // database: string;
  port: number;
  type: string;
  user: string;
  password: string;
  tag: {
    name: string,
    color: string
  };
}
