import React, {Component } from 'react';
import { TextInput, Text, Button, View, FlatList, TouchableOpacity, StyleSheet, Image, Alert  } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


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
        this.props.navigation.navigate("home")
      })
      .catch((error) => {
        console.log(error);
        ToastAndroid.show(error, ToastAndroid.SHORT)
      })
    Alert.alert(this.state.password, this.state.email)
  }

    render(){

        const navigation = this.props.navigation;
        
        return (
            <View style={styles.flexContainer}>
                <Text style={styles.formLabel}>login</Text>
                <TextInput placeholder="Username" onChangeText={this.updateEmail}/>
                <TextInput secureTextEntry={true} placeholder="Password" onChangeText={this.updatePassword}/>
                <Button title="Log in" onPress={this.login}/>
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
    color:'red',
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



export default login;