/* eslint-disable no-return-assign */
/* eslint-disable no-undef */
/* eslint-disable prefer-template */
/* eslint-disable no-throw-literal */
/* eslint-disable no-else-return */
/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-unused-expressions */
import React, {Component } from 'react';
import {Text, Button, View, ActivityIndicator, ToastAndroid  } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LocationComponent from './renderComponents/locationComponent';
import { sharedStyles } from './Styles/Shared';

class location extends Component {


  constructor(props){
    super(props);

    this.state={
      isLoading: true,
      location: null
    }
  }

  componentDidMount() {
    this.unsubscribe - this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
      this.getUserReviews();
    });
  }

  checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    if (value == null) {
        this.props.navigation.navigate("login");
    }
  }


  getData = async () => {
    const {loc_id} = this.props.route.params;
    const value = await AsyncStorage.getItem('@session_token');
    return fetch('http://10.0.2.2:3333/api/1.0.0/location/' + JSON.stringify(loc_id),
    {headers: {
        'X-Authorization': value
      }},)
    .then((response)=> {
        if (response.status === 200){
            return response.json()
        }
        else if(response.status === 404){
            throw 'Location not fund';
        }
        else{
            throw 'Server error'
        }
      })
    .then(async (responseJson) => {
        this.setState({
            isLoading: false,
            location: responseJson,
        });
    })
    .catch((error) =>{
        ToastAndroid.show(error, ToastAndroid.SHORT)
    });
}

getUserReviews = async () => {
  const value = await AsyncStorage.getItem('@session_token');
  const userId = await AsyncStorage.getItem('@user_id');
  return fetch('http://10.0.2.2:3333/api/1.0.0/user/' + userId,
  {headers: {
      'X-Authorization': value
    }},)
  .then((response)=> {
      if (response.status === 200){
          return response.json()
      }
      else if(response.status === 400){
        throw 'bad request';
      }
      else if(response.status === 401){
        throw 'Must be logged in';
      }
      else if(response.status === 403){
        throw 'Forbidden';
      }
      else if(response.status === 404){
        throw 'User not found';
      }
      else{
          throw 'Server error'
      }
    })
  .then(async (responseJson) => {
    const userReviews = [];
    for (let index = 0; index < responseJson.reviews.length; index++) {
      userReviews.push(responseJson.reviews[index].review.review_id);
    }
    await AsyncStorage.setItem('@userReviews', JSON.stringify(userReviews));
    this.getData();
  })
  .catch((error) =>{
      ToastAndroid.show(error, ToastAndroid.SHORT)
  });
}


  render(){

    if(this.state.isLoading){
      return(
          <View>
              <Text>Loading...</Text>
              <ActivityIndicator/>
          </View>
      );
    }
    else{
      let locationInfo={}
      return (
        <View style={sharedStyles.flexContainer}>
          <Button title="Create Review" onPress={ () => this.props.navigation.navigate("createreview", {"loc_id": this.state.location.location_id})} />
          <LocationComponent navigation={this.props.navigation} data={locationInfo={onProfilePage: false,location: this.state.location}} />
        </View>
    );
  }
           
    
  }

    
  
}




export default location;