import React, {Component } from 'react';
import { TextInput, Text, Button, View, FlatList, TouchableOpacity, StyleSheet, Image, Alert, ToastAndroid  } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { shared_styles } from './Styles/Shared';

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
          throw 'wrong'
        }
      })
      .then(async (responseJson)=>{
        console.log(responseJson)
        await AsyncStorage.setItem('@session_token', responseJson.token);
        await AsyncStorage.setItem('@user_id',  responseJson.id.toString());
        this.getData();
        this.props.navigation.navigate("home")
      })
      .catch((error) => {
        console.log(error);
        ToastAndroid.show(error, ToastAndroid.SHORT)
      })
    }
  }

  getData = async () => {
    console.log("get profile data");
    const value = await AsyncStorage.getItem('@session_token');
    const user_id = await AsyncStorage.getItem('@user_id');
    console.log(value);
    return fetch('http://10.0.2.2:3333/api/1.0.0/user/' + user_id,
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
            throw 'error'
        }
      })
    .then(async (responseJson) => {
      let userFavourite_locations = [];
      for (let index = 0; index < responseJson.favourite_locations.length; index++) {
        userFavourite_locations.push(responseJson.favourite_locations[index].location_id);
      }
      console.log(userFavourite_locations);
      console.log(userFavourite_locations.length);
      await AsyncStorage.setItem('@userFavourite_locations', JSON.stringify(userFavourite_locations));

      let userReviews = [];
      for (let index = 0; index < responseJson.reviews.length; index++) {
        userReviews.push(responseJson.reviews[index].review.review_id);
      }
      console.log(userReviews);
      console.log(userReviews.length);
      await AsyncStorage.setItem('@userReviews', JSON.stringify(userReviews));

      let userLiked_reviews = [];
      for (let index = 0; index < responseJson.liked_reviews.length; index++) {
        userLiked_reviews.push(responseJson.liked_reviews[index].review.review_id);
      }
      console.log(userLiked_reviews);
      console.log(userLiked_reviews.length);
      await AsyncStorage.setItem('@userLiked_reviews', JSON.stringify(userLiked_reviews));
      
    })
    .catch((error) =>{
        console.log(error);
    });
}

    render(){

        const navigation = this.props.navigation;
        return (
            <View style={shared_styles.flexContainer}>
                <Text style={shared_styles.formLabel}>Login</Text>
                <TextInput placeholder="Email" onChangeText={this.updateEmail}/>
                <TextInput secureTextEntry={true} placeholder="Password" onChangeText={this.updatePassword}/>
                <Button title="Log in" onPress={this.login}/>
            </View>
        );
    }
}




export default login;