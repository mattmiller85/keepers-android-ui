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
        <Button style={styles.mainbutton} title="Add a keeper from a new picture" onPress={ () => this.openCamera() }></Button>
        <Button style={styles.mainbutton} title="Add a keeper from an existing picture" onPress={ () => this.openPictures() }></Button>
        <Button style={styles.mainbutton} title={`View Unsent`} onPress={ () => this.viewUnsent() }></Button>
      </View>
    );
  }

  viewUnsent() {
    alert("Here!");
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
});

export default class App extends React.Component {

  constructor() {
    super();
    this.state = {
      statusMessage: `Trying to connecting to ${cfg.wsUrl}...`,
      connectedToKeepers: false,
      unsentCount: 0
    };
    this.configureClient();
  }

  componentDidMount() {
    //this.setState(async () => { unsentCount: (await this._client.getAllUnsent()).length });
  }

  configureClient() {
    this._client = new KeepersClient();
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
    return <View style={styles.container}>
        <KeepersApp />
        <Text>{this.state.statusMessage} { this.state.unsentCount } unsent messages.</Text>
        { this.state.connectedToKeepers ? 
          <Button title="Reconnect" onPress={ () => this.configureClient() }></Button> :
          <View />
        }
      </View>
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
 