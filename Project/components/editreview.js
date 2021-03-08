/* eslint-disable radix */
/* eslint-disable dot-notation */
/* eslint-disable no-else-return */
/* eslint-disable object-shorthand */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-throw-literal */
/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable prefer-template */
/* eslint-disable no-undef */
import React, {Component } from 'react';
import { TextInput, Text, Button, View, PermissionsAndroid, ToastAndroid  } from 'react-native';
import { RNCamera } from 'react-native-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { sharedStyles } from './Styles/Shared';


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
      review: review,
      cameraOpen: false
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
      const value = await AsyncStorage.getItem('@session_token');
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
        ToastAndroid.show(error, ToastAndroid.SHORT)
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
          return true;
        }
        else {
          return false;
        }
      } catch (error) {
        ToastAndroid.show(error, ToastAndroid.SHORT)
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
          ToastAndroid.show(error, ToastAndroid.SHORT)
        })
  
      }
        
    }

    updateOverallRating = (overallRating) => {
      this.setState({overall_rating: overallRating})
    }
  
    updatepriceRating = (priceRating) => {
      this.setState({price_rating: priceRating})
    }

    updateQualityRating = (qualityRating) => {
      this.setState({quality_rating: qualityRating})
    }
  
    updateClenlinessRating = (clenlinessRating) => {
      this.setState({clenliness_rating: clenlinessRating})
    }

    updateReviewBody = (reviewBody) => {
      this.setState({review_body: reviewBody})
    }

    deleteReview = async () => {
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
            ToastAndroid.show(error, ToastAndroid.SHORT)
          })
        }

        deleteReviewPhoto = async () => {
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
                ToastAndroid.show(error, ToastAndroid.SHORT)
              })
            }

            openCamera = () => {
              this.setState({cameraOpen: true})
            }

            closeCamera = () => {
              this.setState({cameraOpen: false})
            }

    render(){
        
        return (
            <View style={sharedStyles.flexContainer}>
              <View style={sharedStyles.profileEditContainer}>
                <Text style={sharedStyles.regularText}>Overall Rating: </Text>
                <TextInput value={this.state.overall_rating.toString()} maxLength={1} onChangeText={this.updateOverallRating}/>
              </View>
              <View style={sharedStyles.profileEditContainer}>
                <Text style={sharedStyles.regularText}>Price Rating: </Text>
                <TextInput value={this.state.price_rating.toString()} maxLength={1} onChangeText={this.updatepriceRating}/>
              </View>
              <View style={sharedStyles.profileEditContainer}>
                <Text style={sharedStyles.regularText}>Quality Rating: </Text>
                <TextInput value={this.state.quality_rating.toString()} maxLength={1} onChangeText={this.updateQualityRating}/>
              </View>
              <View style={sharedStyles.profileEditContainer}>
              <Text style={sharedStyles.regularText}>Cleanliness Rating: </Text>
              <TextInput value={this.state.clenliness_rating.toString()} maxLength={1} onChangeText={this.updateClenlinessRating}/>
              </View>
              
              <Text style={sharedStyles.regularText}>Review Body: </Text>
              <TextInput value={this.state.review_body}  onChangeText={this.updateReviewBody}/>
              {this.state.cameraOpen ? (
                  <RNCamera ref={ref => {
                    this.camera = ref;
                  }}
                  style={sharedStyles.preview}
                  />
                ) : (
                  <Button title="Open Camera" onPress={() => {this.openCamera()}}/>
                )
                }
                {this.state.cameraOpen ? (
                 <Button title="Take Photo" onPress={() => {this.takePicture()}}/>
                ) : (
                  <View/>
                )
                }
              <Button title="Close Camera" onPress={() => {this.closeCamera()}}/>
              <Button title="Delete Review Photo" onPress={() => {this.deleteReviewPhoto()}}/>
              <Button title="Submit Review Edit" onPress={() => {this.updateReview()}}/>
              <Button title="Delete Review" onPress={() => {this.deleteReview()}}/>
            </View>
        );
    }
  
}




export default editreview;