import React from 'react'
import { Text, View, TouchableOpacity } from 'react-native'
//import { Camera, Permissions, FileSystem } from 'expo'
import Camera from 'react-native-camera'
import Permissions from 'react-native-permissions';

export class PictureTaker extends React.Component {

    static navigationOptions = {
        title: 'New Picture'
    };

  state = {
    hasCameraPermission: null,
    type:'back'
  };

  async componentWillMount() {
    const status = await Permissions.check('camera');
    this.setState({
      hasCameraPermission: status === 'authorized' || status === 'restricted'
    });
  }

  async takePicture() {
    const result = await this.camera.capture();
    this.props.navigation.navigate('AddScreen', { keepersClient: this.props.screenProps.keepersClient, image_url: result.path });
  }

  render() {
    const {hasCameraPermission} = this.state;
    if (hasCameraPermission === null) {
      return <View/>;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>
    } else {
      return (
        <View style={{ flex: 1 }}>
          <Camera ref={(cam) => {
              this.camera = cam;
            }} 
            playSoundOnCapture={false}
            style={{ flex: 1 }} 
            type={this.state.type}>
            <View
              style={{
                flex: 1,
                backgroundColor: 'transparent',
                flexDirection: 'row',
              }}>
              <TouchableOpacity
                style={{
                  flex: 0.5,
                  alignSelf: 'flex-end',
                  alignItems: 'center',
                }} 
                onPress={async () => {
                  this.takePicture();
                }}>
                <Text
                  style={{ fontSize: 18, marginBottom: 10, color: 'white' }}>
                  {' '}Take Picture{' '}
                </Text>
              </TouchableOpacity>
            </View>
          </Camera>
        </View>
      );
    }
  }
}
