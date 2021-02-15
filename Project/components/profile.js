import React, {Component } from 'react';
import { TextInput, Text, Button, View, FlatList, TouchableOpacity, StyleSheet, Image, PermissionsAndroid, Alert } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';

class profile extends Component {

  constructor(props){
    super(props);

    this.state={
      location: null,
      locationPermission: false,
      latlong: {
        latitude: 0,
        longitude: 0
      }
    }
  }

  componentDidMount(){
    this.findCoordinates();
  }

  findCoordinates = () => {
    this.state.locationPermission = this.requestLocationPermission();
    if (!this.state.locationPermission){
      this.state.locationPermission = this.requestLocationPermission();
    }


    Geolocation.getCurrentPosition((position) => {
        this.setState({ latlong: {
          longitude: position.coords.longitude,
          latitude: position.coords.latitude
        }})
        console.log(this.state.latlong.latitude);
    console.log(this.state.latlong.longitude);;
      },
      (error) => {
        Alert.alert(error.message)
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 1000
      }    
    );
  }

  requestLocationPermission = async () => {
    try{
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location permission',
          message: 'This app requires access to your location',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'Ok'
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('you can access location');
        this.locationPermission = true;
        return true;
      }
      else {
        console.log('Location permission denied');
        this.locationPermission = false;
        return false;
      }
    } catch (err) {
      console.warn(err);
    }
  }

    render(){

        const navigation = this.props.navigation;
        
        return (
            <View style={styles.flexContainer}>
                <MapView
                  provider={PROVIDER_GOOGLE}
                  style={styles.map}
                  region={{
                    latitude: this.state.latlong.latitude,
                    longitude: this.state.latlong.longitude,
                    latitudeDelta: 0.002,
                    longitudeDelta: 0.002
                  }}
                  >
                    <Marker
                      coordinate={this.state.latlong}
                      title="My location"
                      description="Here I am"
                    />
                  </MapView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
    flexDirection: 'column'
  },
  formLabel: {
    fontSize:15,
    color:'steelblue',
  },
  map: {
    flex: 1
  },
  viewText: {
    flex: 4,
    justifyContent: 'center',
    alignItems: 'center'
  }
})



export default profile;