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
        this.props.navigation.navigate("home")
      })
      .catch((error) => {
        console.log(error);
        ToastAndroid.show(error, ToastAndroid.SHORT)
      })
    }
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