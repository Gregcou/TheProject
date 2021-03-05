import React, {Component } from 'react';
import { TextInput, Text, Button, View, FlatList, TouchableOpacity, StyleSheet, Image, Alert, PermissionsAndroid, ToastAndroid  } from 'react-native';
import { RNCamera } from 'react-native-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { shared_styles } from './Styles/Shared';


class editreview extends Component {

  constructor(props){
    super(props);


    const {loc_id, review} = this.props.route.params;
    // this.state.loc_id = JSON.stringify(loc_id);
    // this.state.review = review;
    // console.log(typeof review);
    // console.log(this.state.review);
    // this.state.overall_rating = review.overall_rating;
    // this.state.price_rating = review.price_rating;
    // this.state.quality_rating = review.quality_rating;
    // this.state.clenliness_rating = review.clenliness_rating;
    // this.state.review_body = review.review_body;

    this.state={
      overall_rating: review.overall_rating,
      price_rating: review.price_rating,
      quality_rating: review.quality_rating,
      clenliness_rating: review.clenliness_rating,
      review_body:review.review_body,
      loc_id: JSON.stringify(loc_id),
      review: review
    }
  }

  componentDidMount() {
    
    }

  takePicture = async() => {
    this.requestCameraPermission();
    if (this.camera) {
      const options = { quality: 0.5, base64: true };
      const data = await this.camera.takePictureAsync(options);
      console.log(data.uri);
      const value = await AsyncStorage.getItem('@session_token');
      console.log(value);
      return fetch("http://10.0.2.2:3333/api/1.0.0/location/1/review/8/photo", {
        method: 'POST',
        headers: {
          'Content-Type': 'image/jpeg',
          'X-Authorization': value
        },
        body: data
      })
      .then((response)=> {
        Alert.alert("Picture Added!");
      })
      .catch((error) => {
        console.error(error);
      });
    }
  }

    requestCameraPermission = async () => {
      try{
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera permission',
            message: 'This app requires access to your camera',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'Ok'
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('you can access location');
          return true;
        }
        else {
          console.log('Location permission denied');
          return false;
        }
      } catch (err) {
        console.warn(err);
      }
    }

    editeReview =  async () => {
      if(this.state.overall_rating == null && this.state.price_rating == null && this.state.quality_rating == null && this.state.clenliness_rating == null && this.state.review_body == "" ){
        ToastAndroid.show("Please enter at least one value to be edited", ToastAndroid.SHORT)
      }
      else{
        reviewInfoObject={}
        reviewInfoObject['overall_rating'] = parseInt(this.state.overall_rating);
        reviewInfoObject['price_rating'] = parseInt(this.state.price_rating);
        reviewInfoObject['quality_rating'] = parseInt(this.state.quality_rating);
        reviewInfoObject['clenliness_rating'] = parseInt(this.state.clenliness_rating);
        reviewInfoObject['review_body'] = this.state.review_body;
        const value = await AsyncStorage.getItem('@session_token');
        return fetch("http://10.0.2.2:3333/api/1.0.0/location/" + this.state.loc_id + "/review/" + this.state.review.review_id, {
          method: 'patch',
          headers: {
            'Content-Type': 'application/json',
            'X-Authorization': value
          },
          body: JSON.stringify(reviewInfoObject)
        })
        .then((response)=> {
          if (response.status === 201){
            ToastAndroid.show("Review edited", ToastAndroid.SHORT);
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
      this.setState({overall_rating: overall_rating})
    }
  
    updateprice_rating = (price_rating) => {
      this.setState({price_rating: price_rating})
    }

    updateQuality_rating = (quality_rating) => {
      this.setState({quality_rating: quality_rating})
    }
  
    updateClenliness_rating = (clenliness_rating) => {
      this.setState({clenliness_rating: clenliness_rating})
    }

    updateReview_body = (review_body) => {
      this.setState({review_body: review_body})
    }

    deleteReview = async () => {
        console.log("delete function");
        const value = await AsyncStorage.getItem('@session_token');
        return fetch('http://10.0.2.2:3333/api/1.0.0/location/' + this.state.loc_id + "/review/" + this.state.review.review_id, {
            method: 'delete',
            headers: {
                'X-Authorization': value
            },
          })
          .then((response)=> {
            if (response.status === 200){
                ToastAndroid.show("Review Deleted", ToastAndroid.SHORT)
                this.props.navigation.goBack();
            }
            else if(response.status === 401){
              throw 'Unauthorised logout';
            }
            else{
              throw 'error'
            }
          })
          .catch((error) => {
            console.log(error);
            ToastAndroid.show(error, ToastAndroid.SHORT)
          })
        }

    render(){

        const navigation = this.props.navigation;
        
        return (
            <View style={shared_styles.flexContainer}>
            <Text style={shared_styles.formLabel}>{this.state.review.review_id} </Text>
              <Text style={shared_styles.formLabel}>Overall Rating: </Text>
              <TextInput value={this.state.overall_rating.toString()} maxLength={1} onChangeText={this.updateOverall_rating}/>
              <Text style={shared_styles.formLabel}>Price Rating: </Text>
              <TextInput value={this.state.price_rating.toString()} maxLength={1} onChangeText={this.updateprice_rating}/>
              <Text style={shared_styles.formLabel}>Quality Rating: </Text>
              <TextInput value={this.state.quality_rating.toString()} maxLength={1} onChangeText={this.updateQuality_rating}/>
              <Text style={shared_styles.formLabel}>Cleanliness Rating: </Text>
              <TextInput value={this.state.clenliness_rating.toString()} maxLength={1} onChangeText={this.updateClenliness_rating}/>
              <Text style={shared_styles.formLabel}>Review Body: </Text>
              <TextInput value={this.state.review_body}  onChangeText={this.updateReview_body}/>
              <Button title="Edit Review" onPress={() => {this.editeReview()}}/>
              <Button title="Delete" onPress={() => {this.deleteReview()}}/>
              {/* <RNCamera ref={ref => {
                this.camera = ref;
              }}
              style={shared_styles.preview}
              />
              <Button title="Take Photo" onPress={() => {this.takePicture()}}/> */}
            </View>
        );
    }
  
}




export default editreview;