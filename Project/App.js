import 'react-native-gesture-handler';
import React, {Component, useState, useEffect} from 'react';
import { TextInput, Text, Button, View, FlatList, TouchableOpacity, StyleSheet, Image, ActivityIndicator  } from 'react-native';
import { Container } from 'native-base';
import { NavigationContainer, StackActions } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import login from './components/login';
import signup from './components/signup';






const Tabs = createBottomTabNavigator();


class HelloWorldApp extends Component {
    render(){

        return (
            <NavigationContainer>
              <Tabs.Navigator tabBarOptions={{
                activeTintColor: 'blue',
                inactiveTintColor: 'grey',
                labelStyle: {fontSize: 30}}}
              initialRouteName="login"> 
                <Tabs.Screen name="login" component={login}></Tabs.Screen>
                <Tabs.Screen name="signup" component={signup}></Tabs.Screen>
              </Tabs.Navigator>
            </NavigationContainer>
        );
    }
}

const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
    flexDirection: 'column-reverse'
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
  },
  title: {
    color:'steelblue',
    backgroundColor:'lightblue',
    padding:10,
    fontSize:25,
    flex: 1
  }
})





export default HelloWorldApp;