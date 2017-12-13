import { EventEmitter } from 'events';
import cfg from './Config';
import { AsyncStorage } from 'react-native';
import { v4 as uuid } from 'react-native-uuid';
import { MessageType } from './core/messages';

export class KeepersClient extends EventEmitter {

  async send(message) {
    if (this.ws.readyState !== 1) { // Open
      await this.addUnsentItem(message);
      this.emit("sent", ["offline"]);
      return Promise.resolve();
    }
    this.emit("sent", ["online"]);
    this.ws.send(JSON.stringify(message));
  }

  async addUnsentItem(message) {
    let currentUnsentQueue = await this.getAllUnsent();
    currentUnsentQueue.push(message);
    if(!message.id || message.id === "")
      message.id = uuid();
    await this.setUnsentItems(currentUnsentQueue);
  }

  async clearUnsentItem(id) {
    var unsent = await this.getAllUnsent();
    unsent.splice(unsent.findIndex(item => item.id === id), 1);
    await this.setUnsentItems(unsent)
  }

  async clearAllUnsent() {
    await this.setUnsentItems([]);
  }

  async setUnsentItems(unsentItemsArray) {
    await AsyncStorage.setItem("KeepersUnsent", JSON.stringify(unsentItemsArray), (err) => {
      if(err)
        console.error(err);
    });
    this.emit("unsentChanged");
  }

  async getAllUnsent() {
    return JSON.parse(await AsyncStorage.getItem("KeepersUnsent") || "[]")
  }


  async addUnprocessedItem(message) {
    let currentUnprocessedQueue = await this.getAllUnprocessed();
    currentUnprocessedQueue.push(message);
    if(!message.id || message.id === "")
      message.id = uuid();
    await this.setUnprocessedItems(currentUnprocessedQueue);
  }

  async clearUnprocessedItem(id) {
    var unprocessed = await this.getAllUnprocessed();
    unprocessed.splice(unprocessed.findIndex(item => item.id === id), 1);
    await this.setUnprocessedItems(unprocessed)
  }

  async clearAllUnprocessed() {
    await this.setUnprocessedItems([]);
  }

  async setUnprocessedItems(unprocessedItemsArray) {
    await AsyncStorage.setItem("KeepersUnprocessed", JSON.stringify(unprocessedItemsArray), (err) => {
      if(err)
        console.error(err);
    });
    this.emit("unprocessedChanged");
  }

  async getAllUnprocessed() {
    return JSON.parse(await AsyncStorage.getItem("KeepersUnprocessed") || "[]")
  }

  searchDocuments(searchMessage) {
    this.ws.send(JSON.stringify(searchMessage));
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
      var message = JSON.parse(e.data);
      if (message.type === MessageType.search_results) {
        this.emit("searchComplete", message.results)
      } 
      this.emit("message", message);
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