import React, {Component } from 'react';
import { TextInput, Text, Button, View, FlatList, TouchableOpacity, StyleSheet, Image, ActivityIndicator, ToastAndroid  } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { shared_styles } from './Styles/Shared';

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
      let userLiked_reviews = await AsyncStorage.getItem('@userLiked_reviews');
      this.state.userLiked_reviews = JSON.parse(userLiked_reviews);

      let userReviews = await AsyncStorage.getItem('@userReviews');
      this.state.userReviews = JSON.parse(userReviews);
      console.log(this.state.userLiked_reviews)
      console.log(this.state.userReviews)
      this.setState({
        isLoading: false
      });
    }


    likeReview = async () => {
      console.log("LIKE");
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
              let userLiked_reviews = await AsyncStorage.getItem('@userLiked_reviews');
              this.state.userLiked_reviews = JSON.parse(userLiked_reviews);
              this.state.userLiked_reviews.push(this.props.data.review.review_id);
              this.setState(this.state);
              await AsyncStorage.setItem('@userLiked_reviews', JSON.stringify(this.state.userLiked_reviews));
              console.log(this.state.userLiked_reviews);
          }
          else if(response.status === 400 || response.status === 401 || response.status === 404 || response.status === 500){
            throw 'error liking review';
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

      removeLikeReview = async () => {
        console.log(" REMOVE LIKE");
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
                console.log(this.state.userLiked_reviews);
                let userLiked_reviews = await AsyncStorage.getItem('@userLiked_reviews');
                this.state.userLiked_reviews = JSON.parse(userLiked_reviews);
                let index = this.state.userLiked_reviews.indexOf(this.props.data.review.review_id);
                this.state.userLiked_reviews.splice(index,1);
                this.setState(this.state);
                await AsyncStorage.setItem('@userLiked_reviews', JSON.stringify(this.state.userLiked_reviews));
                console.log(this.state.userLiked_reviews);
            }
            else if(response.status === 400 || response.status === 401 || response.status === 404 || response.status === 500){
              throw 'error liking review';
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

      onErrorGettingImage = () => {
        this.setState({hasPic: false})
      }

      deleteReview = async () => {
        console.log("delete function");
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
            <View style={shared_styles.flexContainer}>
                <Text style={shared_styles.formLabel}>overall rating{review.overall_rating} </Text>
                <Text style={shared_styles.formLabel}>price {review.price_rating}</Text>
                <Text style={shared_styles.formLabel}>quality {review.quality_rating}</Text>
                <Text style={shared_styles.formLabel}>cleanliness {review.clenliness_rating}</Text>
                <Text style={shared_styles.formLabel}>{review.review_body}</Text>
                <Text style={shared_styles.formLabel}>{review.likes} likes</Text>
               
                
                <Image
                  source={{uri: 'http://10.0.2.2:3333/api/1.0.0/location/' + this.props.data.location_id + "/review/" + this.props.data.review.review_id + "/photo?timestamp=" + Date.now()}}
                  style={shared_styles.pic}
                  onError={this.onErrorGettingImage}
                />
                {this.state.userLiked_reviews.includes(review.review_id) ? (
                  <TouchableOpacity
                  style={shared_styles.likedButton}
                  onPress={ () => this.removeLikeReview()}
                  >
                  <Text>LIKED</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                  style={shared_styles.button}
                  onPress={ () => this.likeReview()}
                  >
                  <Text>LIKE</Text>
                  </TouchableOpacity>
                )
                }

                {this.state.userReviews.includes(review.review_id) ? (
                  <TouchableOpacity
                  style={shared_styles.likedButton}
                  onPress={ () => this.props.navigation.navigate("editreview", {"loc_id": this.props.data.location_id,"review": review})}
                  >
                  <Text>EDIT REVIEW</Text>
                  </TouchableOpacity>
                ) : (
                  <View></View>
                )
                }


                
                
                {/* {this.state.hasPic ? (
                  <Image
                  source={{uri: 'http://10.0.2.2:3333/api/1.0.0/location/' + this.props.data.location_id + "/review/" + this.props.data.review.review_id + "/photo"}}
                  style={shared_styles.pic}
                  onError={this.onErrorGettingImage}
                  />
                ) : (
                  <View></View>
                )
                } */}
                
            </View>
        );
      }
        
    }
}




export default Review;