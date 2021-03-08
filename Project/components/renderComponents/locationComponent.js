/* eslint-disable prefer-destructuring */
/* eslint-disable no-throw-literal */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable prefer-template */
import React, {Component } from 'react';
import {Text, View, TouchableOpacity, ToastAndroid} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { sharedStyles } from '../Styles/Shared';
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
        const userFavouriteLocations = await AsyncStorage.getItem('@userFavourite_locations');
        this.state.userFavourite_locations = JSON.parse(userFavouriteLocations);
        this.setState({
          isLoading: false
        });
      }

      favouriteLocation = async () => {
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
                const userFavouriteLocations = await AsyncStorage.getItem('@userFavourite_locations');
                this.state.userFavourite_locations = JSON.parse(userFavouriteLocations);
                this.state.userFavourite_locations.push(this.props.data.location.location_id);
                this.setState(this.state);
                await AsyncStorage.setItem('@userFavourite_locations', JSON.stringify(this.state.userFavourite_locations));
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
            ToastAndroid.show(error, ToastAndroid.SHORT)
          })
        }
  
        removeFavouriteLocatation = async () => {
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
                  const userFavouriteLocations = await AsyncStorage.getItem('@userFavourite_locations');
                  this.state.userFavourite_locations = JSON.parse(userFavouriteLocations);
                  const index = this.state.userFavourite_locations.indexOf(this.props.data.location.location_id);
                  this.state.userFavourite_locations.splice(index,1);
                  this.setState(this.state);
                  await AsyncStorage.setItem('@userFavourite_locations', JSON.stringify(this.state.userFavourite_locations));
                  if (this.props.data.onProfilePage)
                  {
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
              ToastAndroid.show(error, ToastAndroid.SHORT)
            })
          }

    render(){

        const location = this.props.data.location;
        const locationReviews={reviewList: location.location_reviews,location_id: location.location_id}
        return (
            <View style={sharedStyles.flexContainer}>
                <Text style={sharedStyles.regularText}>{location.location_name}</Text>
                <Text style={sharedStyles.regularText}>{location.location_town}</Text>
                <Text style={sharedStyles.regularText}>Average overall rating: {location.avg_overall_rating} </Text>
                <Text style={sharedStyles.regularText}>Average price rating: {location.avg_price_rating}</Text>
                <Text style={sharedStyles.regularText}>Average quality rating: {location.avg_quality_rating}</Text>
                <Text style={sharedStyles.regularText}>Average clenliness rating: {location.avg_clenliness_rating}</Text>
                {this.state.userFavourite_locations.includes(location.location_id) ? (
                  <TouchableOpacity
                  style={sharedStyles.likedButton}
                  onPress={ () => this.removeFavouriteLocatation()}
                  >
                  <Text style={sharedStyles.subTitleText}>FAVOURITED</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                  style={sharedStyles.button}
                  onPress={ () => this.favouriteLocation()}
                  >
                  <Text style={sharedStyles.subTitleText}>FAVOURITE</Text>
                  </TouchableOpacity>
                )
                }
                {this.props.data.onProfilePage ? (
                    <View />
                ) : (
                    <Reviewlist style={sharedStyles.reviewList} navigation={this.props.navigation} data={locationReviews} />
                )
                }
                
            </View>
        );
    }
}




export default LocationComponent;