/* eslint-disable react/prop-types */
/* eslint-disable no-throw-literal */
/* eslint-disable no-else-return */
/* eslint-disable no-undef */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable object-shorthand */
import React, {Component } from 'react';
import { TextInput, Text, Button, View, ToastAndroid  } from 'react-native';
import { sharedStyles } from './Styles/Shared';


class signup extends Component {

  constructor(props){
    super(props);

    this.state={
      first_name: "",
      last_name: "",
      email: "",
      password: ""
    }
  }

  updatefirstName = (firstName) => {
    this.setState({first_name: firstName})
  }

  updatelastName = (lastName) => {
    this.setState({last_name: lastName})
  }

  updateEmail = (email) => {
    this.setState({email: email})
  }

  updatePassword = (password) => {
    this.setState({password: password})
  }

  signUp = () => {
    if(this.state.first_name === "" || this.state.last_name === "" || this.state.email === "" || this.state.password === "" ){
      ToastAndroid.show("Enter first name, last name, email and password", ToastAndroid.SHORT)
    }
    else if(!this.state.email.includes("@")){
      ToastAndroid.show("Please use a valid email address", ToastAndroid.LONG)
    }
    else{
      const toSend = {
        first_name: this.state.first_name,
        last_name: this.state.last_name,
        email: this.state.email,
        password: this.state.password
      };

      return fetch("http://10.0.2.2:3333/api/1.0.0/user", {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(toSend)
      })
      .then((response)=> {
        if (response.status === 201){
          return response.json()
        }
        else if(response.status === 400){
          throw 'Bad request';
        }
        else{
          throw 'Server error'
        }
      })
      .then((responseJson)=>{
        ToastAndroid.show("Account created", ToastAndroid.LONG)
        this.props.navigation.navigate("login")
      })
      .catch((error) => {
        ToastAndroid.show(error, ToastAndroid.SHORT)
      })

    }
      
  }

    render(){


        return (
          <View style={sharedStyles.flexContainer}>
              <Text style={sharedStyles.regularText}>sign up</Text>
              <TextInput label="First name" placeholder="first name" onChangeText={this.updatefirstName} value={this.state.first_name}/>
              <TextInput label="Last name" placeholder="last name" onChangeText={this.updatelastName} value={this.state.last_name}/>
              <TextInput label="Email address" placeholder="email address" onChangeText={this.updateEmail} value={this.state.email}/>
              <TextInput label="Password" maxLength={14} secureTextEntry placeholder="Password" onChangeText={this.updatePassword} value={this.state.password}/>
              <Button title="Sign Up" onPress={this.signUp}/>
          </View>
        );
    }
}



export default signup;