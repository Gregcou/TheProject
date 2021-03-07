import React, {Component } from 'react';
import { TextInput, Text, Button, View, FlatList, TouchableOpacity, StyleSheet, Image, Alert, PermissionsAndroid, ToastAndroid  } from 'react-native';
import { RNCamera } from 'react-native-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { shared_styles } from './Styles/Shared';


class editreview extends Component {

  constructor(props){
    super(props);


    const {loc_id, review} = this.props.route.params;

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
  takePicture = async() => {
    this.requestCameraPermission();
    if (this.camera) {
      const options = { quality: 0.5, base64: true };
      const data = await this.camera.takePictureAsync(options);
      console.log(data.uri);
      const value = await AsyncStorage.getItem('@session_token');
      console.log(value);
      return fetch("http://10.0.2.2:3333/api/1.0.0/location/" + this.state.loc_id + "/review/" +  this.state.review.review_id + "/photo", {
        method: 'POST',
        headers: {
          'Content-Type': 'image/jpeg',
          'X-Authorization': value
        },
        body: data
      })
      .then((response)=> {
        if (response.status === 200){
          ToastAndroid.show("Picture posted", ToastAndroid.SHORT);
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

    updateReview =  async () => {
      if(this.state.overall_rating == null && this.state.price_rating == null && this.state.quality_rating == null && this.state.clenliness_rating == null && this.state.review_body == "" ){
        ToastAndroid.show("Please enter at least one value to be edited", ToastAndroid.SHORT)
      }
      else if(this.state.review_body.toLowerCase().includes("tea") || this.state.review_body.toLowerCase().includes("cake") || this.state.review_body.toLowerCase().includes("pastry") || this.state.review_body.toLowerCase().includes("pastries")){
        ToastAndroid.show("Please do not mention tea, cakes or pastries in your review", ToastAndroid.SHORT)
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
          else if(response.status === 401){
            throw 'Must be logged in';
          }
          else if(response.status === 403){
            throw 'Forbidden';
          }
          else if(response.status === 404){
            throw 'Review not found';
          }
          else{
            throw 'Server error'
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
            else if(response.status === 400){
              throw 'Bad request';
            }
            else if(response.status === 401){
              throw 'Must be logged in';
            }
            else if(response.status === 403){
              throw 'Forbidden';
            }
            else if(response.status === 404){
              throw 'Review not found';
            }
            else{
              throw 'Server error'
            }
          })
          .catch((error) => {
            console.log(error);
            ToastAndroid.show(error, ToastAndroid.SHORT)
          })
        }

        deleteReviewPhoto = async () => {
            console.log("delete function");
            const value = await AsyncStorage.getItem('@session_token');
            return fetch('http://10.0.2.2:3333/api/1.0.0/location/' + this.state.loc_id + "/review/" + this.state.review.review_id + "/photo", {
                method: 'delete',
                headers: {
                    'X-Authorization': value
                },
              })
              .then((response)=> {
                if (response.status === 200){
                    ToastAndroid.show("Photo Deleted", ToastAndroid.SHORT)
                }
                else if(response.status === 401){
                  throw 'Must be logged in';
                }
                else if(response.status === 403){
                  throw 'Forbidden';
                }
                else if(response.status === 404){
                  throw 'Review not found';
                }
                else{
                  throw 'Server error'
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
            <Text style={shared_styles.regularText}>{this.state.review.review_id} </Text>
              <Text style={shared_styles.regularText}>Overall Rating: </Text>
              <TextInput value={this.state.overall_rating.toString()} maxLength={1} onChangeText={this.updateOverall_rating}/>
              <Text style={shared_styles.regularText}>Price Rating: </Text>
              <TextInput value={this.state.price_rating.toString()} maxLength={1} onChangeText={this.updateprice_rating}/>
              <Text style={shared_styles.regularText}>Quality Rating: </Text>
              <TextInput value={this.state.quality_rating.toString()} maxLength={1} onChangeText={this.updateQuality_rating}/>
              <Text style={shared_styles.regularText}>Cleanliness Rating: </Text>
              <TextInput value={this.state.clenliness_rating.toString()} maxLength={1} onChangeText={this.updateClenliness_rating}/>
              <Text style={shared_styles.regularText}>Review Body: </Text>
              <TextInput value={this.state.review_body}  onChangeText={this.updateReview_body}/>
              <Button title="Edit Review" onPress={() => {this.updateReview()}}/>
              <Button title="Delete Review" onPress={() => {this.deleteReview()}}/>
              <RNCamera ref={ref => {
                this.camera = ref;
              }}
              style={shared_styles.preview}
              />
              <Button title="Take Photo" onPress={() => {this.takePicture()}}/>
              <Button title="Delete Review Photo" onPress={() => {this.deleteReviewPhoto()}}/>
            </View>
        );
    }
  
}




export default editreview;