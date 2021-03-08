/* eslint-disable no-return-assign */
/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prefer-stateless-function */
import React, {Component} from 'react';
import {View, FlatList} from 'react-native';
import Review from './review';
import {sharedStyles} from './Styles/Shared';

class Reviewlist extends Component {

  render() {
    const reviews = this.props.data.reviewList;
    let location_reviews = {};
    return (
      <View style={sharedStyles.flexContainer}>
        <FlatList
          data={reviews}
          renderItem={({item}) => (
            <View style={sharedStyles.reviewList}>
              <Review
                navigation={this.props.navigation}
                data={
                  (location_reviews = {
                    review: item,
                    location_id: this.props.data.location_id,
                  })
                }
              />
            </View>
          )}
          keyExtractor={(item) => item.review_id.toString()}
        />
      </View>
    );
  }
}

export default Reviewlist;
