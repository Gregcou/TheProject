import React, {Component } from 'react';
import { TextInput, Text, View, Button, FlatList, TouchableOpacity, StyleSheet, Image  } from 'react-native';
import Review from './review';


class Reviewlist extends Component {

    constructor(props){
        super(props);

        // this.state={
        //     isLoading: true,
        // }
    }

    render(){

        const reviews = this.props.data;
        
        return (
            <View style={styles.flexContainer}>
                <FlatList
                        data={reviews}
                        renderItem={({item}) => (
                            <View>
                                <Review data={item}></Review>
                            </View>
                        )}
                        keyExtractor={(item,index) => item.review_id.toString()}
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
    flex: 8
  },
  viewText: {
    flex: 4,
    justifyContent: 'center',
    alignItems: 'center'
  }
})



export default Reviewlist;