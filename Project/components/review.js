import React, {Component } from 'react';
import { TextInput, Text, Button, View, FlatList, TouchableOpacity, StyleSheet, Image  } from 'react-native';



class Review extends Component {

    constructor(props){
        super(props);

        // this.state={
        //     isLoading: true,
        // }
    }

    render(){

        const review = this.props.data;
        
        return (
            <View style={styles.flexContainer}>
                <Text style={styles.formLabel}>{review.review_overallrating} overall</Text>
                <Text style={styles.formLabel}>{review.review_pricerating} price</Text>
                <Text style={styles.formLabel}>{review.review_qualityrating} quality</Text>
                <Text style={styles.formLabel}>{review.review_clenlinessrating} clenliness</Text>
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
    flexDirection: 'column'
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