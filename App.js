//ts-check
import React from 'react';
import { StackNavigator } from 'react-navigation';
import { StyleSheet, Text, View, Button } from 'react-native';
import { PictureTaker } from './PictureTaker';
import { AddScreen } from './AddScreen';
import { UnsentView } from './UnsentView';
import { UnprocessedView } from './UnprocessedView';
import ImagePicker from 'react-native-image-picker'
import cfg from "./Config"

import { KeepersClient } from "./KeepersClient";
import { MessageType } from './core/messages';

class HomeScreen extends React.Component {

  constructor() {
    super();
  }

  static navigationOptions = {
    title: 'Keepers!'
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={{ marginBottom: 10 }}><Button title="Add a keeper from a new picture" onPress={ () => this.openCamera() }></Button></View>
        <View style={{ marginBottom: 10 }}><Button title="Add a keeper from an existing picture" onPress={ () => this.openPictures() }></Button></View>
        <View style={{ marginBottom: 10 }}><Button title="View Unsent" onPress={ () => this.viewUnsent() }></Button></View>
        <View style={{ marginBottom: 10 }}><Button title="View Unprocessed" onPress={ () => this.viewUnprocessed() }></Button></View>
      </View>
    );
  }

  viewUnsent() {
    this.props.navigation.navigate('UnsentView');
  }

  viewUnprocessed() {
    this.props.navigation.navigate('UnprocessedView');
  }

  openCamera() {
    this.props.navigation.navigate('PictureTaker');
  }

  openPictures() {
    ImagePicker.launchImageLibrary({ }, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }
      else {
        this.props.navigation.navigate('AddScreen', { image_url: response.uri });
      }
    });
  }
  
}

const KeepersApp = StackNavigator({
  Home: { screen: HomeScreen },  
  PictureTaker: { screen: PictureTaker },
  AddScreen: { screen: AddScreen },
  UnsentView: { screen: UnsentView },
  UnprocessedView: { screen: UnprocessedView },
}, { initialRouteName: "Home" });

export default class App extends React.Component {

  constructor() {
    super();
    this.state = {
      statusMessage: `Trying to connecting to ${cfg.wsUrl}...`,
      connectedToKeepers: false,
      unsentCount: 0,
      unprocessedCount: 0
    };
    this.configureClient();
  }

  componentDidMount() {
    this._client.getAllUnsent().then(items => this.setState({ unsentCount: items.length }));
    this._client.getAllUnprocessed().then(items => this.setState({ unprocessedCount: items.length }));
  }

  configureClient() {
    this._client = new KeepersClient();
    this._client.on("unsentChanged", () => {
      this._client.getAllUnsent().then(items => this.setState({ unsentCount: items.length }));
    });
    this._client.on("unprocessedChanged", () => {
      this._client.getAllUnprocessed().then(items => this.setState({ unprocessedCount: items.length }));
    });
    this._client.on("message", (message) => {
      debugger;
      if (message.type === MessageType.queue_for_indexing) {
        // Then this is an "ack" essentially, the message has been queued for pickup by a worker.
        // put it in "unprocessed"
        this._client.addUnprocessedItem(message);
      }

      if (message.type === MessageType.indexing_finished) {
        // This means the message has been indexed into elastic, remove it from "unprocessed";
        this._client.clearUnprocessedItem(message.id);
      }
      
    });
    this._client.on("connected", () => this.setState(previous => {
      return { statusMessage: "Connected.", connectedToKeepers: true }
    }));
    this._client.on("error", (e) => this.setState(previous => {
      return { statusMessage: `Error: ${e.message}.` }
    }));
    this._client.on("closed", (e) => this.setState(previous => {
      return { statusMessage: `Connection Closed: ${e.reason}.`, connectedToKeepers: false }
    }));
  }

  render() {
    return (<View style={styles.container}>
          <KeepersApp style={{flex: 1}} screenProps={{ keepersClient: this._client }}></KeepersApp>
          <View style={{flex: 0.1 }}><Text>{this.state.statusMessage} { this.state.unsentCount } unsent messages, { this.state.unprocessedCount } unprocessed.</Text>
          { !this.state.connectedToKeepers ? 
            <Button title="Reconnect" onPress={ () => this.configureClient() }></Button> :
            <View style={{flex: 1}} />
          }
          </View>
        </View>
      );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center'
  }
});
 