import React, {Component } from 'react';
import { TextInput, Text, Button, View, FlatList, TouchableOpacity, StyleSheet, Image, Alert, PermissionsAndroid, ToastAndroid  } from 'react-native';
import { RNCamera } from 'react-native-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { shared_styles } from './Styles/Shared';


class createreview extends Component {

  constructor(props){
    super(props);


    this.state={
      overall_rating: null,
      price_rating: null,
      quality_rating: null,
      clenliness_rating: null,
      review_body: ""
    }
  }


    createReview =  async () => {
      if(this.state.overall_rating == null || this.state.price_rating == null || this.state.quality_rating == null || this.state.clenliness_rating == null || this.state.review_body == "" ){
        ToastAndroid.show("Enter all ratings and review body", ToastAndroid.SHORT)
      }
      else{
        const {loc_id} = this.props.route.params;
        const value = await AsyncStorage.getItem('@session_token');
        return fetch("http://10.0.2.2:3333/api/1.0.0/location/" + JSON.stringify(loc_id) + "/review", {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
            'X-Authorization': value
          },
          body: JSON.stringify(this.state)
        })
        .then((response)=> {
          if (response.status === 201){
            ToastAndroid.show("Review created", ToastAndroid.SHORT);
            this.setState({
              overall_rating: null,
              price_rating: null,
              quality_rating: null,
              clenliness_rating: null,
              review_body: ""
            });
            this.props.navigation.goBack();
          }
          else if(response.status === 400){
            throw 'Bad request';
          }
          else{
            throw 'wrong'
          }
        })
        .catch((error) => {
          console.log(error);
          ToastAndroid.show(error, ToastAndroid.SHORT)
        })
  
      }
        
    }

    updateOverall_rating = (overall_rating) => {
      this.setState({overall_rating: parseInt(overall_rating)})
    }
  
    updateprice_rating = (price_rating) => {
      this.setState({price_rating: parseInt(price_rating)})
    }

    updateQuality_rating = (quality_rating) => {
      this.setState({quality_rating: parseInt(quality_rating)})
    }
  
    updateClenliness_rating = (clenliness_rating) => {
      this.setState({clenliness_rating: parseInt(clenliness_rating)})
    }

    updateReview_body = (review_body) => {
      this.setState({review_body: review_body})
    }

    render(){

        const navigation = this.props.navigation;
        
        return (
            <View style={shared_styles.flexContainer}>
              <Text style={shared_styles.formLabel}>Overall Rating: </Text>
              <TextInput placeholder="0" maxLength={1} onChangeText={this.updateOverall_rating}/>
              <Text style={shared_styles.formLabel}>Price Rating: </Text>
              <TextInput placeholder="0" maxLength={1} onChangeText={this.updateprice_rating}/>
              <Text style={shared_styles.formLabel}>Quality Rating: </Text>
              <TextInput placeholder="0" maxLength={1} onChangeText={this.updateQuality_rating}/>
              <Text style={shared_styles.formLabel}>Cleanliness Rating: </Text>
              <TextInput placeholder="0" maxLength={1} onChangeText={this.updateClenliness_rating}/>
              <Text style={shared_styles.formLabel}>Review Body: </Text>
              <TextInput placeholder="..."  onChangeText={this.updateReview_body}/>
              <Button title="Create Review" onPress={() => {this.createReview()}}/>
            </View>
        );
    }
  
}




export default createreview;