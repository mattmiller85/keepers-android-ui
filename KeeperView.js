//ts-check
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  Image,
  FlatList,
  TextInput
} from 'react-native';
import {KeepersClient} from './KeepersClient'

import { SearchRequestMessage, SearchResultsMessage } from './core/messages.js'

export class KeeperView extends React.Component {

  constructor() {
    super();
    this.client = () => this.props.screenProps.keepersClient;
    this.keeper_id = () => this.props.navigation.state.params.keeper_id;
    this.state = {
      has_keeper: false,
      keeper: {}
    };
  }

  static navigationOptions = {
    title: 'View'
  };

  componentWillMount() {
    this.client().on("searchComplete", (resultsMessage) => {
      debugger;
      if(resultsMessage.results && resultsMessage.results.length > 0 && resultsMessage.results[0].id === this.keeper_id())
        this.setState({ has_keeper: true, keeper: resultsMessage.results[0] });
    });
    this
      .client()
      .searchDocuments(new SearchRequestMessage({ documentId: this.keeper_id() }))
    }

  render() {
    return (this.state.has_keeper
      ? (
        <View style={styles.container}>
          <Image style={{ flex:1, alignSelf: 'stretch', height: undefined, width: undefined }} resizeMode="contain"
              source={{ uri: `data:image/png;base64,${this.state.keeper.image_enc}`}}></Image>
        </View>)
      : (<Text>Loading</Text>));
  }  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});