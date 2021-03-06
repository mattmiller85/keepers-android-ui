//ts-check
import React from 'react';
import {StyleSheet, Text, View, Button, Image, FlatList} from 'react-native';

export class UnprocessedView extends React.Component {

  constructor() {
    super();
    this.client = () => this.props.screenProps.keepersClient;
    this.state = {
      messages: [
        {
          id: "Loading..."
        }
      ]
    };
  }

  static navigationOptions = {
    title: 'Unprocessed Documents'
  };

  componentDidMount() {
    this.getMessages();
  }

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          data={this.state.messages}
          renderItem={this._renderItem}
          keyExtractor={item => item.id}/>
        <Button title="Clear all unprocessed" onPress={async() => this.clearAll()}></Button>
      </View>
    );
  }

  _renderItem = ({item}) => (
    <View style={styles.horizontalList}>
      <Image
        source={item.document
        ? {
          uri: `data:image/png;base64,${item.document.image_enc}`
        }
        : {
          uri: `https://cdnjs.cloudflare.com/ajax/libs/galleriffic/2.0.1/css/loader.gif`
        }}
        style={{
        width: 100,
        height: 150
      }}></Image>
      <View style={{
        marginRight: 10
      }}>
        <Button title="Retry" onPress={async() => this.addDocument(item)}></Button>
      </View>
      <Button title="Remove" onPress={async() => this.removeUnprocessedItem(item)}></Button>
    </View>
  );

  async clearAll() {
    await this
      .client()
      .clearAllUnprocessed();
    this
      .props
      .navigation
      .navigate('Home');
  }

  async addDocument(msg) {
    await this
      .client()
      .send(msg);
    await this
      .client()
      .clearUnprocessedItem(msg.id);
    this.getMessages();
  }

  async removeUnprocessedItem(msg) {
    let id = msg.id;
    await this
      .client()
      .clearUnprocessedItem(id);
    this.getMessages();
  }

  getMessages() {
    return this
      .client()
      .getAllUnprocessed()
      .then(messages => {
        // TODO: Here, check the elastic index for each message id, if it made it, remove it from "unprocessed" and re-save unprocessed
        this.setState({messages: messages});
      });
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
