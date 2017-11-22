//ts-check
import React from 'react';
import { StackNavigator } from 'react-navigation';
import ImagePicker from 'react-native-image-picker'
import { StyleSheet, Text, View } from 'react-native';
import * as messages from './core/messages.js';
import RNFetchBlob from 'react-native-fetch-blob';

export class PhotoChooser extends React.Component {

    constructor(){
        super();
        this._client = new KeepersClient();
    }

  static navigationOptions = {
    title: 'Add Document'
  };

  componentDidMount() {
  }

  render() {
    return (
      <View style={styles.container}>
        
      </View>
    );
  }

  async addDocument() {
      let msg = new messages.QueueForIndexingMessage();
      let stream = await RNFetchBlob.fs.readFile(this.props.navigation.state.params.image_url, 'base64');
      msg.document = { image_enc: stream };
      this._client.send(msg);
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