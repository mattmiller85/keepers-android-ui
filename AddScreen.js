//ts-check
import React from 'react';
import { StackNavigator } from 'react-navigation';
import { StyleSheet, Text, View, Button, Image } from 'react-native';
import * as messages from './core/messages.js';
import RNFetchBlob from 'react-native-fetch-blob';

export class AddScreen extends React.Component {

    constructor(){
        super();
        this.client = () => this.props.screenProps.keepersClient;
    }

  static navigationOptions = ({ navigation, screenProps }) => { 
    return ({
      title: 'Add Document'
    })
  };

  componentDidMount() {
  }

  render() {
    return (
      <View style={styles.container}>
        <Image source={{uri: this.props.navigation.state.params.image_url }} style={{ width: 200, height:300 }} ref={(img) => this.img = img }></Image> 
        <Button title="Add!" onPress={ async () => this.addDocument() }></Button>
      </View>
    );
  }

  async addDocument() {
      let msg = new messages.QueueForIndexingMessage();
      let stream = await RNFetchBlob.fs.readFile(this.props.navigation.state.params.image_url, 'base64');
      msg.document = { image_enc: stream };
      this.client().send(msg);
      this.props.navigation.navigate('Home');
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