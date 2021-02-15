import React, {Component } from 'react';
import { TextInput, Text, Button, View, FlatList, TouchableOpacity, StyleSheet, Image, Alert, PermissionsAndroid, ActivityIndicator  } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Reviewlist from './reviewlist';

class location extends Component {


  constructor(props){
    super(props);

    this.state={
      isLoading: true,
      location: [],
      loc_id: 0
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
    const navigation = this.props.navigation;
        return (
            <View style={styles.flexContainer}>
                {console.log(this.state.loc_id)}
                <Text style={styles.formLabel}>{this.state.loc_id}</Text>
                <Text style={styles.formLabel}>{this.state.location.location_name}</Text>
                <Text style={styles.formLabel}>{this.state.location.location_town}</Text>
                <Reviewlist data={this.state.location.location_reviews,this.state.location.loc_id}></Reviewlist>
                {console.log("location after flatlist 2")}
                {/* <Button title="log out" onPress={() => this.logOut()}/> */}
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
    fontSize:40,
    color:'steelblue',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  viewText: {
    flex: 4,
    justifyContent: 'center',
    alignItems: 'center'
  }
})



export default location;