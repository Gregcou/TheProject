import React, {Component } from 'react';
import { TextInput, Text, Button, View, FlatList, TouchableOpacity, StyleSheet, Image, ToastAndroid  } from 'react-native';
import { shared_styles } from './Styles/Shared';


class reviews extends Component {
    render(){

        const navigation = this.props.navigation;
        
        return (
            <View style={shared_styles.flexContainer}>
                <Text style={shared_styles.formLabel}>reviews</Text>
                <TextInput placeholder="Username"/>
                <TextInput placeholder="Password"/>
                <Button title="button" onPress={() => console.log("button press login")}/>
            </View>
        );
    }
}



export default reviews;