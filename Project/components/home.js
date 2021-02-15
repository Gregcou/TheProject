import React, {Component } from 'react';
import { TextInput, Text, Button, View, FlatList, TouchableOpacity, StyleSheet, Image, ActivityIndicator  } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Reviewlist from './reviewlist';

class home extends Component {

    constructor(props){
        super(props);

        this.state={
            isLoading: true,
            locations: []
        }
    }
    

    componentDidMount() {
        this.unsubscribe - this.props.navigation.addListener('focus', () => {
            this.checkLoggedIn();
        });
        this.getData();
    }

    componentWillUnmount() {
        this.unsubscribe;
    }

    checkLoggedIn = async () => {
        const value = await AsyncStorage.getItem('@session_token');
        if (value == null) {
            this.props.navigation.navigate("login");
        }
    }

    logOut = () =>{
        console.log("logout function");
        AsyncStorage.removeItem('@session_token');
        this.checkLoggedIn()
    }

    getData = async () => {
        console.log("getdata");
        const value = await AsyncStorage.getItem('@session_token');
        console.log(value);
        return fetch('http://10.0.2.2:3333/api/1.0.0/find',
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
                locations: responseJson,
            });
        })
        .catch((error) =>{
            console.log(error);
        });
    }

    

    render(){

        const navigation = this.props.navigation;
        const loc = this.state.locations;
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
                <View>
                    {console.log("vieww")}
                    <FlatList
                        data={this.state.locations}
                        renderItem={({item}) => (
                            <View>
                                <TouchableOpacity
                                    style={styles.button}
                                    onPress={ () => this.props.navigation.navigate("location", {loc_id: item.location_id})}
                                >
                                <Text>{item.location_name}</Text>
                                <Text>{item.location_town}</Text>
                                <Image
                                    source={{uri:item.photo_path}}
                                    style={styles.pic}
                                />
                                </TouchableOpacity>
                            </View>
                        )}
                        keyExtractor={(item,index) => item.location_id.toString()}
                    />
                    {console.log("after flatlist")}
                    {/* <Button title="log out" onPress={() => this.logOut()}/> */}
                </View>
            );
        }      
        
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
    flex: 2
  },
  button: {
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    padding: 10
  },
  viewText: {
    flex: 4,
    justifyContent: 'center',
    alignItems: 'center'
  }
})



export default home;