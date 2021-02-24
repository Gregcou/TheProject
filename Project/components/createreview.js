import React, {Component } from 'react';
import { TextInput, Text, Button, View, FlatList, TouchableOpacity, StyleSheet, Image, Alert, PermissionsAndroid  } from 'react-native';
import { RNCamera } from 'react-native-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';
import shared_styles from './components/Styles/Shared';


class createreview extends Component {

  constructor(props){
    super(props);

  }

  takePicture = async() => {
    this.requestCameraPermission();
    if (this.camera) {
      const options = { quality: 0.5, base64: true };
      const data = await this.camera.takePictureAsync(options);
      console.log(data.uri);
      const value = await AsyncStorage.getItem('@session_token');
      console.log(value);
      return fetch("http://10.0.2.2:3333/api/1.0.0/location/1/review/8/photo", {
        method: 'POST',
        headers: {
          'Content-Type': 'image/jpeg',
          'X-Authorization': value
        },
        body: data
      })
      .then((response)=> {
        Alert.alert("Picture Added!");
      })
      .catch((error) => {
        console.error(error);
      });
    }
  }

    requestCameraPermission = async () => {
      try{
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera permission',
            message: 'This app requires access to your camera',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'Ok'
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('you can access location');
          return true;
        }
        else {
          console.log('Location permission denied');
          return false;
        }
      } catch (err) {
        console.warn(err);
      }
    }

    render(){

        const navigation = this.props.navigation;
        
        return (
            <View style={shared_styles.flexContainer}>
              <RNCamera ref={ref => {
                this.camera = ref;
              }}
              style={shared_styles.preview}
              />
              <Button title="Take Photo" onPress={() => {this.takePicture()}}/>
            </View>
        );
    }
  
}




export default createreview;