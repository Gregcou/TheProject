/* eslint-disable eqeqeq */
/* eslint-disable prefer-const */
/* eslint-disable prefer-template */
/* eslint-disable react/prop-types */
/* eslint-disable no-throw-literal */
/* eslint-disable no-else-return */
/* eslint-disable no-undef */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable object-shorthand */
import React, {Component } from 'react';
import { TextInput, Text, Button, View, ToastAndroid  } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { sharedStyles } from './Styles/Shared';

class login extends Component {

  constructor(props){
    super(props);

    this.state={
      email: "",
      password: ""
    }
  }

  updateEmail = (email) => {
    this.setState({email: email})
  }

  updatePassword = (password) => {
    this.setState({password: password})
  }


  login = async () => {
    if(this.state.email == "" || this.state.password == "" ){
      ToastAndroid.show("Both an email and password are needed to login", ToastAndroid.LONG)
    }
    else if(!this.state.email.includes("@")){
      ToastAndroid.show("Please use a valid email address", ToastAndroid.LONG)
    }
    else{
      return fetch("http://10.0.2.2:3333/api/1.0.0/user/login", {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.state)
      })
      .then((response)=> {
        if (response.status === 200){
          return response.json()
        }
        else if(response.status === 400){
          throw 'Incorrect email or password';
        }
        else{
          throw 'Server error'
        }
      })
      .then(async (responseJson)=>{
        await AsyncStorage.setItem('@session_token', responseJson.token);
        await AsyncStorage.setItem('@user_id',  responseJson.id.toString());
        this.getData();
        this.props.navigation.navigate("home")
      })
      .catch((error) => {
        ToastAndroid.show(error, ToastAndroid.SHORT)
      })
    }
  }

  getData = async () => {
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
        else if(response.status === 401){
            throw 'Unauthorised';
        }
        else if(response.status === 404){
          throw 'Not found';
      }
        else{
            throw 'Server error'
        }
      })
    .then(async (responseJson) => {
      let userFavouriteLocations = [];
      for (let index = 0; index < responseJson.favourite_locations.length; index+=1) {
        userFavouriteLocations.push(responseJson.favourite_locations[index].location_id);
      }
      await AsyncStorage.setItem('@userFavourite_locations', JSON.stringify(userFavouriteLocations));

      let userReviews = [];
      for (let index = 0; index < responseJson.reviews.length; index+=1) {
        userReviews.push(responseJson.reviews[index].review.review_id);
      }
      await AsyncStorage.setItem('@userReviews', JSON.stringify(userReviews));

      let userLikedReviews = [];
      for (let index = 0; index < responseJson.liked_reviews.length; index+=1) {
        userLikedReviews.push(responseJson.liked_reviews[index].review.review_id);
      }
      await AsyncStorage.setItem('@userLiked_reviews', JSON.stringify(userLikedReviews));
      
    })
    .catch((error) =>{
      ToastAndroid.show(error, ToastAndroid.SHORT)
    });
}

    render(){

        return (
            <View style={sharedStyles.flexContainer}>
                <Text style={sharedStyles.subTitleText}>Login</Text>
                <TextInput label="Email Address" placeholder="Email" onChangeText={this.updateEmail}/>
                <TextInput label="Password" maxLength={14} secureTextEntry placeholder="Password" onChangeText={this.updatePassword}/>
                <Button title="Log in" onPress={this.login}/>
            </View>
        );
    }
}




export default login;