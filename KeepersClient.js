import { EventEmitter } from 'events';
import cfg from './Config';
import { AsyncStorage } from 'react-native';

export class KeepersClient extends EventEmitter {

  async send(message) {
    if (this.ws.readyState !== 1) { // Open
      let currentUnsentQueue = JSON.parse(await AsyncStorage.getItem("KeepersUnsent") || []);
      currentUnsentQueue.push(message);
      await AsyncStorage.setItem("KeepersUnsent", currentUnsentQueue);
      return Promise.resolve();
    }
    this.ws.send(JSON.stringify(message));
  }

  async getAllUnsent() {
    return (await AsyncStorage.getItem("KeepersUnsent")) || [];
  }

  constructor() {
    super();
    this.ws = new WebSocket(cfg.wsUrl);

    this.ws.onopen = () => {
      // connection opened ws.send('Hi'); // send a message
      this.emit("connected");
    };

    this.ws.onmessage = (e) => {
      // a message was received
      console.log(e.data);
      this.emit("message", JSON.parse(e.data));
    };

    this.ws.onerror = (e) => {
      // an error occurred
      console.log(e.message);
      this.emit("error", e);
    };

    this.ws.onclose = (e) => {
      // connection closed
      console.log(e.code, e.reason);
      this.emit("closed", e);
    };
  }
}