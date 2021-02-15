import React, {Component } from 'react';
import { TextInput, Text, Button, View, FlatList, TouchableOpacity, StyleSheet, Image  } from 'react-native';



class Review extends Component {

    constructor(props){
        super(props);

        // this.state={
        //     isLoading: true,
        // }
    }

    getData = async () => {
      console.log("getdata");
      const review = this.props.data;
      const value = await AsyncStorage.getItem('@session_token');
      console.log(value);
      return fetch('http://10.0.2.2:3333/api/1.0.0/location/' + review.review_id,
      {headers: {
          'X-Authorization': value
        }},)
      .then((response)=> {
          if (response.status === 200){
              return response.json()
          }
          else if(response.status === 401){
              throw 'not logged in';
          }
          else{
              throw 'wrong'
          }
        })
      .then((responseJson) => {
          this.setState({
              isLoading: false,
              location: responseJson,
          });
      })
      .catch((error) =>{
          console.log(error);
      });
    }

    render(){

        const review = this.props.data;
        
        return (
            <View style={styles.flexContainer}>
                <Text style={styles.formLabel}>{review.overall_rating} overall</Text>
                <Text style={styles.formLabel}>{review.price_rating} price</Text>
                <Text style={styles.formLabel}>{review.quality_rating} quality</Text>
                <Text style={styles.formLabel}>{review.clenliness_rating} clenliness</Text>
                <Text style={styles.formLabel}>{review.review_body}</Text>
                <Text style={styles.formLabel}>{review.likes} likes</Text>
                {console.log(review.overall_rating)}
                
                <Image
                source={{uri:"https://www.anime-planet.com/images/characters/tony-tony-chopper-79.jpg"}}
                style={styles.pic}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
    flexDirection: 'column',
    marginTop: 10
  },
  formLabel: {
    fontSize:15,
    color:'steelblue',
  },
  pic: {
    //flex: 8
    height: 20,
    width: 20
  },
  viewText: {
    flex: 4,
    justifyContent: 'center',
    alignItems: 'center'
  }
})



export default Review;