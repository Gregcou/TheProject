import React, {Component } from 'react';
import { TextInput, Text, Button, View, FlatList, TouchableOpacity, StyleSheet, Image, ActivityIndicator, ToastAndroid  } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Reviewlist from './reviewlist';
import Review from './review';
import { shared_styles } from './Styles/Shared';
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
            console.log(error);
        });
    }

    updateFirst_name = (first_name) => {
      this.setState({first_name: first_name})
    }
  
    updateLast_name = (last_name) => {
      this.setState({last_name: last_name})
    }

    updateEmail = (email) => {
      this.setState({email: email})
    }
  
    updatePassword = (password) => {
      this.setState({password: password})
    }

    updateUserInfo = async () => {
      console.log("update user info")
      if(this.state.first_name == "" && this.state.last_name == "" && this.state.email == "" && this.state.password == ""  ){
        ToastAndroid.show("No new information entered", ToastAndroid.LONG)
      }
      else{
        userInfoObject={}
        console.log(this.state.first_name)
        if(this.state.first_name != ""){
          userInfoObject['first_name'] = this.state.first_name;
          console.log("inside if")
          console.log(this.state.first_name)
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
        const user_id = await AsyncStorage.getItem('@user_id');
        return fetch("http://10.0.2.2:3333/api/1.0.0/user/" + user_id, {
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
          console.log(error);
          ToastAndroid.show(error, ToastAndroid.SHORT)
        })
      }
    }


    

    render(){

        const navigation = this.props.navigation;
        if(this.state.isLoading){
            return(
                <View>
                    <Text>Loading....</Text>
                    <ActivityIndicator/>
                </View>
            );
        }
        else{
          let location_reviews={};
          let locationInfo={};
            return (
                <View>
                    <Text>{this.state.user_info.first_name}</Text>
                    {console.log(this.state.user_info.first_name)}
                    <Text>{this.state.user_info.last_name}</Text>
                    <Text>{this.state.user_info.email}</Text>
                    <Text>Edit details</Text>
                    <TextInput placeholder="First_name" onChangeText={this.updateFirst_name}/>
                    <TextInput placeholder="Last_name" onChangeText={this.updateLast_name}/>
                    <TextInput placeholder="Email" onChangeText={this.updateEmail}/>
                    <TextInput secureTextEntry={true} placeholder="Password" onChangeText={this.updatePassword}/>
                    <Button title="Log in" onPress={this.updateUserInfo}/>
                    <Text>Favourite locations</Text>
                    <FlatList
                        data={this.state.user_info.favourite_locations}
                        renderItem={({item}) => (
                            <View>
                                <LocationComponent updateProfileScreen={this.getData} data={locationInfo={onProfilePage: true,location: item}}></LocationComponent>
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
                              <Review data={location_reviews={review: item.review,location_id: item.location.location_id}}></Review>
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
                              <Review data={location_reviews={review: item.review,location_id: item.location.location_id}}></Review>
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