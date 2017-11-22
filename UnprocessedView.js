//ts-check
import React from 'react';
import { StyleSheet, Text, View, Button, Image } from 'react-native';

export class UnprocessedView extends React.Component {

    constructor(){
        super();
    }

  static navigationOptions = {
    title: 'Unprocessed Documents'
  };

  render() {
    return (
      <View style={styles.container}>
        <Text>This will be things that we queued and got an id for but aren't in the elastic index yet</Text>
      </View>
    );
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