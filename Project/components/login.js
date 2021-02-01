import React, {Component } from 'react';
import { TextInput, Text, Button, View, FlatList, TouchableOpacity, StyleSheet, Image, Alert  } from 'react-native';



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


  login = () => {
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