/* eslint-disable no-else-return */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable prefer-destructuring */
/* eslint-disable prefer-template */
/* eslint-disable no-throw-literal */
import React, {Component } from 'react';
import {Text, View, TouchableOpacity, Image, ActivityIndicator, ToastAndroid  } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { sharedStyles } from './Styles/Shared';

class Review extends Component {

    constructor(props){
        super(props);

        this.state={
            isLoading: true,
            location: "",
            hasPic: true,
            userReviews: [],
            userLiked_reviews: []
        }
    }

    componentDidMount() {
      this.getReviews();
    }

    getReviews = async () => {
      const userLikedReviews = await AsyncStorage.getItem('@userLiked_reviews');
      this.state.userLiked_reviews = JSON.parse(userLikedReviews);

      const userReviews = await AsyncStorage.getItem('@userReviews');
      this.state.userReviews = JSON.parse(userReviews);
      this.setState({
        isLoading: false
      });
    }


    likeReview = async () => {
      const value = await AsyncStorage.getItem('@session_token');
      const review = this.props.data.review;
      return fetch('http://10.0.2.2:3333/api/1.0.0/location/' + this.props.data.location_id + "/review/" + review.review_id + "/like", {
          method: 'post',
          headers: {
              'X-Authorization': value
          },
        })
        .then(async (response)=> {
          if (response.status === 200){
              ToastAndroid.show("Liked", ToastAndroid.SHORT);
              const userLikedReviews = await AsyncStorage.getItem('@userLiked_reviews');
              this.state.userLiked_reviews = JSON.parse(userLikedReviews);
              this.state.userLiked_reviews.push(this.props.data.review.review_id);
              this.setState(this.state);
              await AsyncStorage.setItem('@userLiked_reviews', JSON.stringify(this.state.userLiked_reviews));
          }
          else if(response.status === 400){
            throw 'error liking review';
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

      removeLikeReview = async () => {
        const value = await AsyncStorage.getItem('@session_token');
        const review = this.props.data.review;
        return fetch('http://10.0.2.2:3333/api/1.0.0/location/' + this.props.data.location_id + "/review/" + review.review_id + "/like", {
            method: 'delete',
            headers: {
                'X-Authorization': value
            },
          })
          .then(async (response)=> {
            if (response.status === 200){
                ToastAndroid.show("Like removed", ToastAndroid.SHORT);
                const userLikedReviews = await AsyncStorage.getItem('@userLiked_reviews');
                this.state.userLiked_reviews = JSON.parse(userLikedReviews);
                const index = this.state.userLiked_reviews.indexOf(this.props.data.review.review_id);
                this.state.userLiked_reviews.splice(index,1);
                this.setState(this.state);
                await AsyncStorage.setItem('@userLiked_reviews', JSON.stringify(this.state.userLiked_reviews));
            }
            else if(response.status === 401){
              throw 'Must be logged in';
            }
            else if(response.status === 403){
              throw 'Forbidden';
            }
            else if(response.status === 404){
              throw 'Not found';
            }
            else{
              throw 'Server error'
            }
          })
          .catch((error) => {
            ToastAndroid.show(error, ToastAndroid.SHORT)
          })
        }

      onErrorGettingImage = () => {
        this.setState({hasPic: false})
      }

      deleteReview = async () => {
        const value = await AsyncStorage.getItem('@session_token');
        const review = this.props.data.review;
        return fetch('http://10.0.2.2:3333/api/1.0.0/location/' + this.props.data.location_id + "/review/" + review.review_id, {
            method: 'delete',
            headers: {
                'X-Authorization': value
            },
          })
          .then((response)=> {
            if (response.status === 200){
                ToastAndroid.show("Review Deleted", ToastAndroid.SHORT)
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
              throw 'Not found';
            }
            else{
              throw 'Server error'
            }
          })
          .catch((error) => {
            ToastAndroid.show(error, ToastAndroid.SHORT)
          })
        }

    render(){
        const review = this.props.data.review;
        if(this.state.isLoading){
          return(
              <View>
                  <Text>Loading...</Text>
                  <ActivityIndicator/>
              </View>
          );
        }
        else{
          return (
            <View style={sharedStyles.reviewFlexContainer}>
                <Text style={sharedStyles.regularText}>overall rating{review.overall_rating} </Text>
                <Text style={sharedStyles.regularText}>price {review.price_rating}</Text>
                <Text style={sharedStyles.regularText}>quality {review.quality_rating}</Text>
                <Text style={sharedStyles.regularText}>cleanliness {review.clenliness_rating}</Text>
                <Text style={sharedStyles.regularText}>{review.review_body}</Text>
                <Text style={sharedStyles.regularText}>{review.likes} likes</Text>
               
                {this.state.hasPic ? (
                  <Image
                    source={{uri: 'http://10.0.2.2:3333/api/1.0.0/location/' + this.props.data.location_id + "/review/" + this.props.data.review.review_id + "/photo?timestamp=" + Date.now()}}
                    style={sharedStyles.pic}
                    onError={this.onErrorGettingImage}
                  />
                ) : (
                  <View />
                )
                }


                {this.state.userLiked_reviews.includes(review.review_id) ? (
                  <TouchableOpacity
                  style={sharedStyles.likedButton}
                  onPress={ () => this.removeLikeReview()}
                  >
                  <Text style={sharedStyles.subTitleText}>LIKED</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                  style={sharedStyles.button}
                  onPress={ () => this.likeReview()}
                  >
                  <Text style={sharedStyles.subTitleText}>LIKE</Text>
                  </TouchableOpacity>
                )
                }

                {this.state.userReviews.includes(review.review_id) ? (
                  <TouchableOpacity
                  style={sharedStyles.likedButton}
                  onPress={ () => this.props.navigation.navigate("editreview", {"loc_id": this.props.data.location_id,"review": review})}
                  >
                  <Text style={sharedStyles.subTitleText}>EDIT REVIEW</Text>
                  </TouchableOpacity>
                ) : (
                  <View />
                )
                }
                
            </View>
        );
      }
        
    }
}




export default Review;