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
import home from './components/home';
import profile from './components/profile';
import location from './components/location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import reviews from './components/reviews';
import logout from './components/logout';
import { shared_styles } from './components/Styles/Shared';
import createreview from './components/createreview';
import editreview from './components/editreview';





const Tabs = createBottomTabNavigator();
const Stack = createStackNavigator();

function homestack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="home" component={home} />
      <Stack.Screen name="location" component={location} />
      <Stack.Screen name="reviews" component={reviews} />
      <Stack.Screen name="createreview" component={createreview} />
      <Stack.Screen name="editreview" component={editreview} />
    </Stack.Navigator>
  );
}

class HelloWorldApp extends Component {

  
  

    render(){ 
      

      
      return (
        <NavigationContainer>
            <Tabs.Navigator tabBarOptions={{activeTintColor: 'blue', inactiveTintColor: 'grey',labelStyle: {fontSize: 30}}}initialRouteName="login">
              <Tabs.Screen name="login" component={login}></Tabs.Screen>
              <Tabs.Screen name="signup" component={signup}></Tabs.Screen>
              <Tabs.Screen name="home" component={homestack}></Tabs.Screen>
              <Tabs.Screen name="profile" component={profile}></Tabs.Screen>
              <Tabs.Screen name="logout" component={logout}></Tabs.Screen>
            </Tabs.Navigator>
         </NavigationContainer>
      );
      

      
    }
}





export default HelloWorldApp;