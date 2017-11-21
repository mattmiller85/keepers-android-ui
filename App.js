//ts-check
import React from 'react';
import { StackNavigator } from 'react-navigation';
import { StyleSheet, Text, View, Button } from 'react-native';
import { PictureTaker } from './PictureTaker';
import { AddScreen } from './AddScreen';

class HomeScreen extends React.Component {

  static navigationOptions = {
    title: 'Keepers!'
  };

  render() {
    return (
      <View style={styles.container}>
        <Button style={styles.mainbutton} title="Add a keeper from a new picture" onPress={ () => this.openCamera() }></Button>
        <Button style={styles.mainbutton} title="Add a keeper from an existing picture" onPress={ () => this.openPictures() }></Button>
      </View>
    );
  }

  openCamera() {
    this.props.navigation.navigate('PictureTaker');
  }

  openPictures() {
    
  }
  
}

const KeepersApp = StackNavigator({
  Home: { screen: HomeScreen },
  PictureTaker: { screen: PictureTaker },
  AddScreen: { screen: AddScreen }
});

export default class App extends React.Component {
  render() {
    return <KeepersApp />;
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
 