import React, {Component } from 'react';
import { TextInput, Text, Button, View, FlatList, TouchableOpacity, StyleSheet, Image, Alert, PermissionsAndroid, ActivityIndicator  } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LocationComponent from './renderComponents/locationComponent';
import { shared_styles } from './Styles/Shared';

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
      console.log("Before get user reviews");
      this.getUserReviews();
      console.log("After get user reviews");

      console.log("After listener get data");
    });
    console.log("Before get data in mount");
    //this.getData();
  }


  getData = async () => {
    console.log("getdata");
    const {loc_id} = this.props.route.params;
    const value = await AsyncStorage.getItem('@session_token');
    console.log(value);
    return fetch('http://10.0.2.2:3333/api/1.0.0/location/' + JSON.stringify(loc_id),
    {headers: {
        'X-Authorization': value
      }},)
    .then((response)=> {
        if (response.status === 200){
            return response.json()
        }
        else if(response.status === 401){
            throw 'not logged in';
        }
        else{
            throw 'wrong'
        }
      })
    .then(async (responseJson) => {
        this.setState({
            isLoading: false,
            location: responseJson,
        });
    })
    .catch((error) =>{
        console.log(error);
    });
}

getUserReviews = async () => {
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
    let userReviews = [];
    for (let index = 0; index < responseJson.reviews.length; index++) {
      userReviews.push(responseJson.reviews[index].review.review_id);
    }
    console.log(userReviews);
    await AsyncStorage.setItem('@userReviews', JSON.stringify(userReviews));
    this.getData();
  })
  .catch((error) =>{
      console.log(error);
  });
}


  render(){

    const navigation = this.props.navigation;

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
        <View style={shared_styles.flexContainer}>
          <Button title="Create Review" onPress={ () => this.props.navigation.navigate("createreview", {"loc_id": this.state.location.location_id})}></Button>
          <LocationComponent navigation={this.props.navigation} data={locationInfo={onProfilePage: false,location: this.state.location}}></LocationComponent>
        </View>
    );
  }
           
    
  }

    
  
}




export default location;