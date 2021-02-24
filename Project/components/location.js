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
    this.getData();
  }

  getData = async () => {
    console.log("getdata");
    const {loc_id} = this.props.route.params;
    this.state.loc_id = JSON.stringify(loc_id)
    const value = await AsyncStorage.getItem('@session_token');
    console.log(value);
    return fetch('http://10.0.2.2:3333/api/1.0.0/location/' + this.state.loc_id,
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
    .then((responseJson) => {
        this.setState({
            isLoading: false,
            location: responseJson,
        });
    })
    .catch((error) =>{
        console.log(error);
    });
}


  render(){
    if(this.state.isLoading){
      return(
          <View>
              <Text>Loading...</Text>
              <ActivityIndicator/>
          </View>
      );
    }
    else{
      return (
        <View style={shared_styles.flexContainer}>
            <LocationComponent data={this.state.location}></LocationComponent>
        </View>
    );
  }
           
    
  }

    
  
}




export default location;