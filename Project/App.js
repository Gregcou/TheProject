/* eslint-disable react/prefer-stateless-function */
import 'react-native-gesture-handler';
import React, {Component} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import login from './components/login';
import signup from './components/signup';
import home from './components/home';
import profile from './components/profile';
import location from './components/location';
import logout from './components/logout';
import createreview from './components/createreview';
import editreview from './components/editreview';





const Tabs = createBottomTabNavigator();
const Stack = createStackNavigator();

function homestack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="home" component={home} />
      <Stack.Screen name="location" component={location} />
      <Stack.Screen name="createreview" component={createreview} />
      <Stack.Screen name="editreview" component={editreview} />
    </Stack.Navigator>
  );
}

class HelloWorldApp extends Component {

  
  

    render(){ 
      

      
      return (
        <NavigationContainer>
            <Tabs.Navigator tabBarOptions={{activeTintColor: 'blue', inactiveTintColor: 'grey',labelStyle: {fontSize: 20}}}initialRouteName="login">
              <Tabs.Screen name="login" component={login} />
              <Tabs.Screen name="signup" component={signup} />
              <Tabs.Screen name="home" component={homestack} />
              <Tabs.Screen name="profile" component={profile} />
              <Tabs.Screen name="logout" component={logout} />
            </Tabs.Navigator>
         </NavigationContainer>
      );
      

      
    }
}





export default HelloWorldApp;