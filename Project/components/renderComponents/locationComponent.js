import React, {Component } from 'react';
import { TextInput, Text, View, Button, FlatList, TouchableOpacity, StyleSheet, Image, ToastAndroid  } from 'react-native';
import { shared_styles } from '../Styles/Shared';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Reviewlist from '../reviewlist';

class LocationComponent extends Component {

    constructor(props){
        super(props);

        this.state={
            isLoading: true,
            userFavourite_locations: []
        }
    }

    componentDidMount() {
        this.getLocations();
        
      }


    getLocations = async () => {
        let userFavourite_locations = await AsyncStorage.getItem('@userFavourite_locations');
        this.state.userFavourite_locations = JSON.parse(userFavourite_locations);
        console.log(this.state.userFavourite_locations)
        this.setState({
          isLoading: false
        });
      }

      favouriteLocation = async () => {
        console.log("FAVOURITE");
        const value = await AsyncStorage.getItem('@session_token');
        return fetch('http://10.0.2.2:3333/api/1.0.0/location/' + this.props.data.location.location_id + "/favourite", {
            method: 'post',
            headers: {
                'X-Authorization': value
            },
          })
          .then(async (response)=> {
            if (response.status === 200){
                ToastAndroid.show("Favourited", ToastAndroid.SHORT);
                let userFavourite_locations = await AsyncStorage.getItem('@userFavourite_locations');
                this.state.userFavourite_locations = JSON.parse(userFavourite_locations);
                this.state.userFavourite_locations.push(this.props.data.location.location_id);
                this.setState(this.state);
                await AsyncStorage.setItem('@userFavourite_locations', JSON.stringify(this.state.userFavourite_locations));
                console.log(this.state.userFavourite_locations);
            }
            else if(response.status === 400){
              throw 'error favouriting location';
            }
            else if(response.status === 401){
              throw 'Must be logged in';
            }
            else if(response.status === 404){
              throw 'Not found';
            }
            else{
              throw 'Server error'
            }
          })
          .catch((error) => {
            console.log(error);
            ToastAndroid.show(error, ToastAndroid.SHORT)
          })
        }
  
        removeFavouriteLocatation = async () => {
          console.log(" REMOVE FAVOURITE");
          const value = await AsyncStorage.getItem('@session_token');
          return fetch('http://10.0.2.2:3333/api/1.0.0/location/' + this.props.data.location.location_id + "/favourite", {
              method: 'delete',
              headers: {
                  'X-Authorization': value
              },
            })
            .then(async (response)=> {
              if (response.status === 200){
                  ToastAndroid.show("Favourite removed", ToastAndroid.SHORT);
                  console.log(this.state.userFavourite_locations);
                  let userFavourite_locations = await AsyncStorage.getItem('@userFavourite_locations');
                  this.state.userFavourite_locations = JSON.parse(userFavourite_locations);
                  let index = this.state.userFavourite_locations.indexOf(this.props.data.location.location_id);
                  this.state.userFavourite_locations.splice(index,1);
                  this.setState(this.state);
                  await AsyncStorage.setItem('@userFavourite_locations', JSON.stringify(this.state.userFavourite_locations));
                  console.log(this.state.userFavourite_locations);
                  if (this.props.data.onProfilePage)
                  {
                    console.log("updateProfileScreen")
                    this.props.updateProfileScreen();
                  }
              }
              else if(response.status === 401){
                throw 'Must be logged in';
              }
              else if(response.status === 403){
                throw 'Forbidden';
              }
              else if(response.status === 404){
                throw 'Not found';
              }
              else{
                throw 'Server error'
              }
            })
            .catch((error) => {
              console.log(error);
              ToastAndroid.show(error, ToastAndroid.SHORT)
            })
          }

    render(){

        const location = this.props.data.location;
        const location_reviews={reviewList: location.location_reviews,location_id: location.location_id}
        return (
            <View style={shared_styles.flexContainer}>
                <Text style={shared_styles.formLabel}>{location.location_name}</Text>
                <Text style={shared_styles.formLabel}>{location.location_town}</Text>
                <Text style={shared_styles.formLabel}>Average overall rating: {location.avg_overall_rating} </Text>
                <Text style={shared_styles.formLabel}>Average price rating: {location.avg_price_rating}</Text>
                <Text style={shared_styles.formLabel}>Average quality rating: {location.avg_quality_rating}</Text>
                <Text style={shared_styles.formLabel}>Average clenliness rating: {location.avg_clenliness_rating}</Text>
                {this.state.userFavourite_locations.includes(location.location_id) ? (
                  <TouchableOpacity
                  style={shared_styles.likedButton}
                  onPress={ () => this.removeFavouriteLocatation()}
                  >
                  <Text style={shared_styles.subTitleText}>FAVOURITED</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                  style={shared_styles.button}
                  onPress={ () => this.favouriteLocation()}
                  >
                  <Text style={shared_styles.subTitleText}>FAVOURITE</Text>
                  </TouchableOpacity>
                )
                }
                {this.props.data.onProfilePage ? (
                    <View></View>
                ) : (
                    <Reviewlist navigation={this.props.navigation} data={location_reviews}></Reviewlist>
                )
                }
                
            </View>
        );
    }
}




export default LocationComponent;