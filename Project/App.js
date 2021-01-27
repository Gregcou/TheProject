import React, {Component, useState, useEffect} from 'react';
import { TextInput, Text, Button, View, FlatList, TouchableOpacity } from 'react-native';
import { Container } from 'native-base';

// class SayHello extends Component {
//   render() {
//     return(
//       <View>
//         <Text>Hello {this.props.name}</Text>
//       </View>
//     );
//   }
// }


class HelloWorldApp extends Component {

  constructor(props){
    super(props);

    this.state = {
      text: '',
      list_items: []
    };

    this.add = this.add.bind(this);
    this.remove = this.remove.bind(this);
  }

  add = (text) => {
    if(text.trim().length > 0){
      this.setState(

        prevState => {
          let { list_items } = prevState;
          return({
            list_items: list_items.concat(text),
            text: ""
          });
        }
      );
    }
  }

  remove = (i) => {
    this.setState(
      prevState => {
        let list_items = prevState.list_items.slice();

        list_items.splice(i, 1);

        return { list_items };
      }
    );
  }

  handleInput = (text) => {
    this.setState({text: text})
  }


    render(){

        return (
          <View>
          <TextInput placeholder="ToDo..." onChangeText={this.handleInput} value={this.state.text} />
          <TouchableOpacity
             onPress = {
                () => this.add(this.state.text)
             }>
             <Text> Add </Text>
          </TouchableOpacity>
          <FlatList
            data={this.state.list_items}
            renderItem={({ item, index }) =>
              <Container>
              <Text>{item}</Text>
              <TouchableOpacity onPress={() => this.remove(index)}>
                 <Text> Done </Text>
              </TouchableOpacity>
              </Container>
            }
          />
        </View>
        );
    }
}


// class HelloWorldApp extends Component {
//     render(){

//         return (
//             <View>
//               <TextInput placeholder="enter activity"/>
//                 <SayHello name="Gregory" />
//                 <SayHello name="nene" />
//                 <SayHello name="umiko" />
//             </View>
//         );
//     }
// }


// const Blink = (props) => {
//   const [isShowingText, setIsShowingText] = useState(true);

//    useEffect(() => {
//      const toggle = setInterval(() => {
//        setIsShowingText(!isShowingText);
//      }, 4000);

//      return () => clearInterval(toggle);
//   })

//   if (!isShowingText) {
//     return null;
//   }

//   return <Text>{props.text}</Text>;
// }

// const BlinkApp = () => {
//   return (
//     <View style={{marginTop: 100}}>
//       <Blink text='I love to blink' />
//       <Blink text='Yes blinking is so great' />
//       <Blink text='Why did they ever take this out of HTML' />
//       <Blink text='Look at me look at me look at me' />
//     </View>
//   );
// }

export default HelloWorldApp;