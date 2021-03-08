/* eslint-disable no-return-assign */
/* eslint-disable dot-notation */
/* eslint-disable eqeqeq */
/* eslint-disable object-shorthand */
/* eslint-disable no-throw-literal */
/* eslint-disable no-else-return */
/* eslint-disable prefer-template */
/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-unused-expressions */
import React, {Component } from 'react';
import { TextInput, Text, Button, View, FlatList, ActivityIndicator, ToastAndroid  } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Review from './review';
import { sharedStyles } from './Styles/Shared';
import LocationComponent from './renderComponents/locationComponent';

class home extends Component {

    constructor(props){
        super(props);

        this.state={
            isLoading: true,
            user_info: [],
            first_name: "",
            last_name: "",
            email: "",
            password: ""
        }
    }
    

    componentDidMount() {
        this.unsubscribe - this.props.navigation.addListener('focus', () => {
            this.checkLoggedIn();
            this.getData();
        });
        
    }

    componentWillUnmount() {
        this.unsubscribe;
    }

    checkLoggedIn = async () => {
        const value = await AsyncStorage.getItem('@session_token');
        if (value == null) {
            this.props.navigation.navigate("login");
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
                throw 'Must be logged in';
            }
            else if(response.status === 404){
              throw 'User not found';
          }
            else{
                throw 'Server error'
            }
          })
        .then((responseJson) => {
            this.setState({
                isLoading: false,
                user_info: responseJson,
            });
        })
        .catch((error) =>{
          ToastAndroid.show(error, ToastAndroid.SHORT)
        });
    }

    updateFirstName = (firstName) => {
      this.setState({first_name: firstName})
    }
  
    updateLastName = (lastName) => {
      this.setState({last_name: lastName})
    }

    updateEmail = (email) => {
      this.setState({email: email})
    }
  
    updatePassword = (password) => {
      this.setState({password: password})
    }

    updateUserInfo = async () => {
      if(this.state.first_name == "" && this.state.last_name == "" && this.state.email == "" && this.state.password == ""  ){
        ToastAndroid.show("No new information entered", ToastAndroid.LONG)
      }
      else{
        userInfoObject={}
        if(this.state.first_name != ""){
          userInfoObject['first_name'] = this.state.first_name;
        }

        if(this.state.last_name != ""){
          userInfoObject['last_name'] = this.state.last_name;
        }
        
        if(this.state.email != ""){
          userInfoObject['email'] = this.state.email;
        }
        
        if(this.state.password != ""){
          userInfoObject['password'] = this.state.password;
        }

        const value = await AsyncStorage.getItem('@session_token');
        const userId = await AsyncStorage.getItem('@user_id');
        return fetch("http://10.0.2.2:3333/api/1.0.0/user/" + userId, {
          method: 'patch',
          headers: {
            'Content-Type': 'application/json',
            'X-Authorization': value
          },
          body: JSON.stringify(userInfoObject)
        })
        .then((response)=> {
          if (response.status === 200){
            ToastAndroid.show("User information updated", ToastAndroid.SHORT);
            this.getData();
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
        .catch((error) => {
          ToastAndroid.show(error, ToastAndroid.SHORT)
        })
      }
    }


    

    render(){

        if(this.state.isLoading){
            return(
                <View>
                    <Text>Loading....</Text>
                    <ActivityIndicator/>
                </View>
            );
        }
        else{
          let locationReviews={};
          let locationInfo={};
            return (
                <View>
                    <Text>{this.state.user_info.first_name}</Text>
                    <Text>{this.state.user_info.last_name}</Text>
                    <Text>{this.state.user_info.email}</Text>
                    <Text>Edit details</Text>
                    <TextInput placeholder="First_name" onChangeText={this.updateFirstName}/>
                    <TextInput placeholder="Last_name" onChangeText={this.updateLastName}/>
                    <TextInput placeholder="Email" onChangeText={this.updateEmail}/>
                    <TextInput secureTextEntry placeholder="Password" onChangeText={this.updatePassword}/>
                    <Button title="Log in" onPress={this.updateUserInfo}/>
                    <Text>Favourite locations</Text>
                    <FlatList
                        data={this.state.user_info.favourite_locations}
                        renderItem={({item}) => (
                            <View>
                                <LocationComponent updateProfileScreen={this.getData} data={locationInfo={onProfilePage: true,location: item}} />
                            </View>
                        )}
                        keyExtractor={(item) => item.location_id.toString()}
                    />
                    <Text>Reviews</Text>
                    <FlatList
                        data={this.state.user_info.reviews}
                        renderItem={({item}) => (
                            <View>
                              <Text>----------------------------------</Text>
                              <Text>{item.location.location_name}</Text>
                              <Review data={locationReviews={review: item.review,location_id: item.location.location_id}} />
                            </View>
                        )}
                        keyExtractor={(item,index) => item.review.review_id.toString()}
                    />
                    <Text>Liked reviews</Text>
                    <FlatList
                        data={this.state.user_info.liked_reviews}
                        renderItem={({item}) => (
                            <View>
                              <Text>----------------------------------</Text>
                              <Text>{item.location.location_name}</Text>
                              <Review data={locationReviews={review: item.review,location_id: item.location.location_id}} />
                            </View>
                        )}
                        keyExtractor={(item,index) => item.review.review_id.toString()}
                    />
                </View>
            );
        }      
        
    }
}




export default home;