/* eslint-disable camelcase */
/* eslint-disable radix */
/* eslint-disable no-throw-literal */
/* eslint-disable prefer-template */
/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-unused-expressions */
import React, {Component } from 'react';
import { TextInput, Text, Button, View, ToastAndroid  } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { sharedStyles } from './Styles/Shared';


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

  componentDidMount() {
    this.unsubscribe - this.props.navigation.addListener('focus', () => {
        this.checkLoggedIn();
    });
  }


  checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    if (value == null) {
        this.props.navigation.navigate("login");
    }
  }


    createReview =  async () => {
      if(this.state.overall_rating == null || this.state.price_rating == null || this.state.quality_rating == null || this.state.clenliness_rating == null || this.state.review_body == "" ){
        ToastAndroid.show("Enter all ratings and review body", ToastAndroid.SHORT)
      }
      else if(this.state.review_body.toLowerCase().includes("tea") || this.state.review_body.toLowerCase().includes("cake") || this.state.review_body.toLowerCase().includes("pastry") || this.state.review_body.toLowerCase().includes("pastries")){
        ToastAndroid.show("Please do not mention tea, cakes or pastries in your review", ToastAndroid.SHORT)
      }
      else if(this.state.overall_rating > 5 || this.state.overall_rating < 1 || this.state.price_rating > 5 || this.state.price_rating < 1 || this.state.quality_rating > 5 || this.state.quality_rating < 1 || this.state.clenliness_rating > 5 || this.state.clenliness_rating < 1 ){
        ToastAndroid.show("Review ratings must be between 1 and 5", ToastAndroid.SHORT)
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
          else if(response.status === 401){
            throw 'Must be logged in';
          }
          else if(response.status === 404){
            throw 'Review not found';
          }
          else{
            throw 'Server error'
          }
        })
        .catch((error) => {
          ToastAndroid.show(error, ToastAndroid.SHORT)
        })
  
      }
        
    }

    updateOverallRating = (overallRating) => {
      this.setState({overall_rating: parseInt(overallRating)})
    }
  
    updatepriceRating = (priceRating) => {
      this.setState({price_rating: parseInt(priceRating)})
    }

    updateQualityRating = (qualityRating) => {
      this.setState({quality_rating: parseInt(qualityRating)})
    }
  
    updateClenlinessRating = (clenlinessRating) => {
      this.setState({clenliness_rating: parseInt(clenlinessRating)})
    }

    updateReviewBody = (reviewBody) => {
      this.setState({review_body: reviewBody})
    }

    render(){
        
        return (
            <View style={sharedStyles.flexContainer}>
              <Text style={sharedStyles.regularText}>Overall Rating: </Text>
              <TextInput label="Overall Rating" placeholder="0" maxLength={1} onChangeText={this.updateOverallRating}/>
              <Text style={sharedStyles.regularText}>Price Rating: </Text>
              <TextInput label="Price Rating" placeholder="0" maxLength={1} onChangeText={this.updatepriceRating}/>
              <Text style={sharedStyles.regularText}>Quality Rating: </Text>
              <TextInput label="Quality Rating" placeholder="0" maxLength={1} onChangeText={this.updateQualityRating}/>
              <Text style={sharedStyles.regularText}>Cleanliness Rating: </Text>
              <TextInput label="Cleanliness Rating" placeholder="0" maxLength={1} onChangeText={this.updateClenlinessRating}/>
              <Text style={sharedStyles.regularText}>Review Body: </Text>
              <TextInput label="Review Body" placeholder="..."  onChangeText={this.updateReviewBody}/>
              <Button title="Create Review" onPress={() => {this.createReview()}}/>
            </View>
        );
    }
  
}




export default createreview;