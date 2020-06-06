export interface Connection {
  host: string,
  user: string,
  password: string,
  database: string,
  port: number,
  type: string,
  tag: {
    name: string,
    color: string
  }
}