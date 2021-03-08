/* eslint-disable no-undef */
/* eslint-disable no-throw-literal */
/* eslint-disable no-else-return */
/* eslint-disable no-unused-expressions */
/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import React, {Component } from 'react';
import {Text, View, FlatList, TouchableOpacity, Image, ActivityIndicator, ToastAndroid  } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { sharedStyles } from './Styles/Shared';

class home extends Component {

    constructor(props){
        super(props);

        this.state={
            isLoading: true,
            locations: [],
            hasPic: true
        }
    }
    

    componentDidMount() {
        this.unsubscribe - this.props.navigation.addListener('focus', () => {
            this.checkLoggedIn();
        });
        this.getData();
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
        return fetch('http://10.0.2.2:3333/api/1.0.0/find',
        {headers: {
            'X-Authorization': value
          }},)
        .then((response)=> {
            if (response.status === 200){
                return response.json()
            }
            else if(response.status === 400){
                throw 'Bad request';
            }
            else if(response.status === 401){
                throw 'Must be logged in';
            }
            else{
                throw 'Server error'
            }
          })
        .then((responseJson) => {
            this.setState({
                isLoading: false,
                locations: responseJson,
            });
        })
        .catch((error) =>{
            ToastAndroid.show(error, ToastAndroid.SHORT)
        });
    }

    onErrorGettingImage = () => {
        this.setState({hasPic: false})
      }

    

    render(){

        if(this.state.isLoading){
            return(
                <View>
                    <Text>Loading...</Text>
          <ActivityIndicator />
                </View>
            );
        }
        else{
            return (
                <View>
                    <FlatList
                        data={this.state.locations}
                        renderItem={({item}) => (
                            <View>
                                <TouchableOpacity
                                    style={sharedStyles.button}
                                    onPress={ () => this.props.navigation.navigate("location", {"loc_id": item.location_id})}
                                >
                                <Text style={sharedStyles.subTitleText}>{item.location_name}</Text>
                                <Text style={sharedStyles.subTitleText}>{item.location_town}</Text>
                                {this.state.hasPic ? (
                                <Image
                                source={{uri:item.photo_path}}
                                    style={sharedStyles.pic}
                                    onError={this.onErrorGettingImage}
                                    alt="Location image"
                                />
                                ) : (
                                <View />
                                )
                                }
                                </TouchableOpacity>
                            </View>
                        )}
                        keyExtractor={(item) => item.location_id.toString()}
                    />
                </View>
            );
        }      
        
    }
}




export default home;