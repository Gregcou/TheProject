import React, {Component } from 'react';
import { TextInput, Text, Button, View, FlatList, TouchableOpacity, StyleSheet, Image  } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class home extends Component {
    

    componentDidMount() {
        this.unsubscribe - this.props.navigation.addListener('focus', () => {
            this.checkLoggedIn();
        });
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

    logOut = () =>{
        AsyncStorage.removeItem('@session_token');
        this.checkLoggedIn()
    }

    

    render(){

        const navigation = this.props.navigation;
        
        return (
            <View style={styles.flexContainer}>
                <Text style={styles.formLabel}>home</Text>
                <TextInput placeholder="Username"/>
                <TextInput placeholder="Password"/>
                <Button title="button" onPress={() => this.logOut()}/>
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



export default home;