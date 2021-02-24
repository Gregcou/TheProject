import React, {Component } from 'react';
import { TextInput, Text, Button, View, FlatList, TouchableOpacity, StyleSheet, Image, ActivityIndicator, ToastAndroid  } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { shared_styles } from './Styles/Shared';

class Review extends Component {

    constructor(props){
        super(props);

        this.state={
            isLoading: false,
            location: "",
            hasPic: true
        }
    }

    componentDidMount() {
      //this.getPhoto();
    }

    getPhoto = async () => {
      console.log("getPhoto");
      const review = this.props.data.review;
      const value = await AsyncStorage.getItem('@session_token');
      console.log(value);
      return fetch('http://10.0.2.2:3333/api/1.0.0/location/' + this.props.data.location_id + "/review/" + review.review_id + "/photo", //+ "/photo?timestamp=" + Date.now()
      {headers: {
          'X-Authorization': value
        }},)
      .then((response)=> {
          if (response.status === 200 || response.status === 304){
              return response.blob();
          }
          else if(response.status === 404){
            this.setState({
              isLoading: false,
              hasPic: false
            });
              throw 'no photo found';
          }
          else{
              throw 'wrong'
          }
        })
      .then(async (responseJson) => {
        console.log(responseJson);
        //const url = URL.createObjectURL(responseJson)
          this.setState({
              isLoading: false,
              //location: url,
              hasPic: true
          });
      })
      .catch((error) =>{
          console.log(error);
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
        .then((response)=> {
          if (response.status === 200){
              ToastAndroid.show("Liked", ToastAndroid.SHORT)
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
                <Text style={shared_styles.formLabel}>clenliness {review.clenliness_rating}</Text>
                <Text style={shared_styles.formLabel}>{review.review_body}</Text>
                <Text style={shared_styles.formLabel}>{review.likes} likes</Text>
                <TouchableOpacity
                   style={shared_styles.button}
                   onPress={ () => this.likeReview()}
                >
                  <Text>LIKE</Text>
                </TouchableOpacity>
                
                {/* {console.log(review.review_id)}
                {console.log("uri" + this.state.location)} */}
                {console.log(this.props.data.review.review_id)}
                <Image
                  source={{uri: 'http://10.0.2.2:3333/api/1.0.0/location/' + this.props.data.location_id + "/review/" + this.props.data.review.review_id + "/photo"}}
                  style={shared_styles.pic}
                  onError={this.onErrorGettingImage}
                />
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