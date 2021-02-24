import React, {Component } from 'react';
import { TextInput, Text, View, Button, FlatList, TouchableOpacity, StyleSheet, Image  } from 'react-native';
import { shared_styles } from '../Styles/Shared';
import Reviewlist from '../reviewlist';

class LocationComponent extends Component {

    constructor(props){
        super(props);

        // this.state={
        //     isLoading: true,
        // }
    }

    render(){

        const location = this.props.data;
        const location_reviews={reviewList: location.location_reviews,location_id: location.location_id}
        return (
            <View style={shared_styles.flexContainer}>
                <Text style={shared_styles.formLabel}>{location.location_name}</Text>
                <Text style={shared_styles.formLabel}>{location.location_town}</Text>
                <Text style={shared_styles.formLabel}>Average overall rating: {location.avg_overall_rating} </Text>
                <Text style={shared_styles.formLabel}>Average price rating: {location.avg_price_rating}</Text>
                <Text style={shared_styles.formLabel}>Average quality rating: {location.avg_quality_rating}</Text>
                <Text style={shared_styles.formLabel}>Average clenliness rating: {location.avg_clenliness_rating}</Text>
                <Reviewlist data={location_reviews}></Reviewlist>
            </View>
        );
    }
}




export default LocationComponent;