import React, {Component } from 'react';
import { TextInput, Text, Button, View, FlatList, TouchableOpacity, StyleSheet, Image  } from 'react-native';



class location extends Component {
    render(){

        const navigation = this.props.navigation;
        
        return (
            <View style={styles.flexContainer}>
                <Text style={styles.formLabel}>location</Text>
                <TextInput placeholder="Username"/>
                <TextInput placeholder="Password"/>
                <Button title="button" onPress={() => console.log("button press login")}/>
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



export default location;