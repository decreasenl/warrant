import { ConnectionConfig} from './connection-config.interface';
import { Socket } from 'net';

export interface Connection { 
  config: ConnectionConfig,
  state: string,
  threadId: number

  _events: object,
  _eventsCount: number,
  _socket: Socket,
  _connectCalled: boolean,
  _protocol: any,
  __proto__: any
}
