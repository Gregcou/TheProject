import React, {Component } from 'react';
import { TextInput, Text, Button, View, FlatList, TouchableOpacity, StyleSheet, Image  } from 'react-native';



class signup extends Component {
    render(){


        const navigation = this.props.navigation;

        return (
            <View style={styles.flexContainer}>
                <Text style={styles.formLabel}>sign up</Text>
                <TextInput placeholder="Username"/>
                <TextInput placeholder="Password"/>
                <Button title="buttonnn" onPress={() => console.log("button press sign up")}/>
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



export default signup;