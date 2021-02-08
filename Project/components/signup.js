import { Toast } from 'native-base';
import React, {Component } from 'react';
import { TextInput, Text, Button, View, FlatList, TouchableOpacity, StyleSheet, Image, ActivityIndicator, Alert, ToastAndroid  } from 'react-native';



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

  updatefirst_name = (first_name) => {
    this.setState({first_name: first_name})
  }

  updatelast_name = (last_name) => {
    this.setState({last_name: last_name})
  }

  updateEmail = (email) => {
    this.setState({email: email})
  }

  updatePassword = (password) => {
    this.setState({password: password})
  }

  signUp = () => {
    if(this.state.first_name == "" || this.state.last_name == "" || this.state.email == "" || this.state.password == "" ){
      ToastAndroid.show("Enter first name, last name, email and password", ToastAndroid.SHORT)
    }
    else{
      let to_send = {
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
        body: JSON.stringify(to_send)
      })
      .then((response)=> {
        if (response.status === 201){
          return response.json()
        }
        else if(response.status === 400){
          throw 'fv';
        }
        else{
          throw 'wrong'
        }
      })
      .then((responseJson)=>{
        ToastAndroid.show("Account created", ToastAndroid.LONG)
        this.props.navigation.navigate("login")
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
          <View style={styles.flexContainer}>
              <Text style={styles.formLabel}>sign up</Text>
              <TextInput placeholder="first name" onChangeText={this.updatefirst_name} value={this.state.first_name}/>
              <TextInput placeholder="last name" onChangeText={this.updatelast_name} value={this.state.last_name}/>
              <TextInput placeholder="email address" onChangeText={this.updateEmail} value={this.state.email}/>
              <TextInput secureTextEntry={true} placeholder="Password" onChangeText={this.updatePassword} value={this.state.password}/>
              <Button title="Sign Up" onPress={this.signUp}/>
          </View>
        );
    }
}

const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
    flexDirection: 'column'
  },
  formLabel: {
    fontSize:15,
    color:'steelblue',
  },
  pic: {
    flex: 8
  },
  viewText: {
    flex: 4,
    justifyContent: 'center',
    alignItems: 'center'
  }
})



export default signup;