import React, {Component } from 'react';
import { TextInput, Text, Button, View, FlatList, TouchableOpacity, StyleSheet, Image, Alert, ToastAndroid  } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { shared_styles } from './Styles/Shared';


class logout extends Component {

  constructor(props){
    super(props);
  }



  logout = async () => {
    console.log("logout function");
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
          throw 'Unauthorised logout';
        }
        else{
          throw 'error'
        }
      })
      .catch((error) => {
        console.log(error);
        ToastAndroid.show(error, ToastAndroid.SHORT)
      })
    }

    render(){

        const navigation = this.props.navigation;
        return (
            <View style={shared_styles.flexContainer}>
                <Text style={shared_styles.formLabel}>Logout</Text>
                <Button title="Logout" onPress={this.logout}/>
            </View>
        );
    }
}




export default logout;