/* eslint-disable no-throw-literal */
/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-unused-expressions */
import React, {Component } from 'react';
import {Text, Button, View, ToastAndroid  } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { sharedStyles } from './Styles/Shared';


class logout extends Component {


  componentDidMount() {
    this.unsubscribe - this.props.navigation.addListener('focus', () => {
        this.checkLoggedIn();
    });
  }


  checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    if (value == null) {
        this.props.navigation.navigate("login");
    }
  }



  logout = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    AsyncStorage.removeItem('@session_token');
    return fetch("http://10.0.2.2:3333/api/1.0.0/user/logout", {
        method: 'post',
        headers: {
            'X-Authorization': value
        },
      })
      .then((response)=> {
        if (response.status === 200){
            ToastAndroid.show("Logged out", ToastAndroid.SHORT)
            this.props.navigation.navigate("login")
        }
        else if(response.status === 401){
          throw 'Must be logged in to log out';
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

        return (
            <View style={sharedStyles.flexContainer}>
                <Text style={sharedStyles.regularText}>Logout</Text>
                <Button title="Logout" onPress={this.logout}/>
            </View>
        );
    }
}




export default logout;