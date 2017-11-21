import { EventEmitter } from 'events';
import cfg from './Config';

export class KeepersSocketClient extends EventEmitter {

  send(message) {
    this.ws.send(JSON.stringify(message));
  }

  constructor() {
    super();
    this.ws = new WebSocket(cfg.wsUrl);

    this.ws.onopen = () => {
      // connection opened ws.send('Hi'); // send a message
    };

    this.ws.onmessage = (e) => {
      // a message was received
      console.log(e.data);
    };

    this.ws.onerror = (e) => {
      // an error occurred
      console.log(e.message);
    };

    this.ws.onclose = (e) => {
      // connection closed
      console.log(e.code, e.reason);
    };
  }
}