import React, {Component } from 'react';
import { TextInput, Text, View, Button, FlatList, TouchableOpacity, StyleSheet, Image  } from 'react-native';
import Review from './review';
import { shared_styles } from './Styles/Shared';

class Reviewlist extends Component {

    constructor(props){
        super(props);

        // this.state={
        //     isLoading: true,
        // }
    }

    render(){

        const reviews = this.props.data.reviewList;
        let location_reviews={}
        return (
            <View style={shared_styles.flexContainer}>
                <FlatList
                        data={reviews}
                        renderItem={({item}) => (
                            <View style={shared_styles.reviewList}>
                              <Review navigation={this.props.navigation} data={location_reviews={review: item,location_id: this.props.data.location_id}}></Review>
                            </View>
                        )}
                        keyExtractor={(item,index) => item.review_id.toString()}
                />
            </View>
        );
    }
}




export default Reviewlist;