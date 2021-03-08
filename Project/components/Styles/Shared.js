import { StyleSheet } from 'react-native';

const sharedStyles = StyleSheet.create({
    flexContainer: {
        flex: 1,
        flexDirection: 'column'
      },
      profileEditContainer: {
        alignItems: "center",
        flexDirection: 'row'
      },
      reviewFlexContainer: {
        flex: 1,
        flexDirection: 'column',
        borderWidth: 4,
        borderColor: "#20232a",
        borderRadius: 6,
        margin: 3
      },
      regularText: {
        fontSize:18,
        color:'black',
      },
      subTitleText: {
        fontSize:22,
        color:'black',
      },
      pic: {
        height: 159,
        width: 200,
        resizeMode: 'contain',
        flex: 4,
        alignSelf: "center"
      },
      button: {
        alignItems: "center",
        backgroundColor: "#DDDDDD",
        padding: 10,
      },
      likedButton: {
        alignItems: "center",
        backgroundColor: "#00FF00",
        padding: 10,
      },
      preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center'
      },
      title: {
        color:'steelblue',
        backgroundColor:'lightblue',
        padding:10,
        fontSize:25,
        flex: 1
      },
      viewText: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center'
      },
      reviewList: {
        flex: 10,
      }
});

export { sharedStyles }