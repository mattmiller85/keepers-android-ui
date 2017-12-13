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

export class SearchView extends React.Component {

  constructor() {
    super();
    this.client = () => this.props.screenProps.keepersClient;
    this.state = {
      results: [],
      searchString: "",
    };
  }

  static navigationOptions = {
    title: 'Search'
  };

  componentDidMount() {
    this.client().on("searchComplete", (resultsMessage) => {
      this.setState({ results: resultsMessage.results });
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.horizontalList}>
          <TextInput style={{ flex: 0.8 }} onChangeText={(text) => this.setState({searchString: text})} value={this.state.searchString} />
          <Button title="Search" onPress={() => this.searchDocuments()}></Button>
        </View>
        <FlatList
          style={{ flex:1 }}
          data={this.state.results}
          renderItem={this._renderItem}
          keyExtractor={item => item.id}/>
        <Button style={{ flex: 1 }} title="Clear search" onPress={async() => this.clearSearch()}></Button>
      </View>
    );
  }

  _renderItem = ({item}) => (
    <View>
      <View style={{ flex: 1 }}>
        <Text>{item.text}</Text>
      </View>
      <View style={{
        marginRight: 10
      }}>
        <Button title="View" onPress={() => this.viewDocument(item)}></Button>
      </View>
    </View>
  );

  clearSearch() {
    this.setState({searchString: "", results: []});
  }

  viewDocument(msg) {
    this.props.navigation.navigate('KeeperView', { keeper_id: msg.id });
  }

  searchDocuments() {
    return this
      .client()
      .searchDocuments(new SearchRequestMessage({ searchString: this.state.searchString}))
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  horizontalList: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
