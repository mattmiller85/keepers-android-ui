//ts-check
import React from 'react';
import { StyleSheet, Text, View, Button, Image } from 'react-native';

export class UnsentView extends React.Component {

    constructor(){
        super();
    }

  static navigationOptions = {
    title: 'Unsent Documents'
  };

  render() {
    return (
      <View style={styles.container}>
        <Text>These will be things we tried to index while disconnected.</Text>
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