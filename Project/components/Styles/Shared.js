import { StyleSheet } from 'react-native';

const shared_styles = StyleSheet.create({
    flexContainer: {
        flex: 1,
        flexDirection: 'column'
      },
      formLabel: {
        fontSize:15,
        color:'steelblue',
      },
      pic: {
        height: 100,
        width: 100
      },
      button: {
        alignItems: "center",
        backgroundColor: "#DDDDDD",
        padding: 10
      },
      likedButton: {
        alignItems: "center",
        backgroundColor: "#00FF00",
        padding: 10
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
        flex: 4,
        justifyContent: 'center',
        alignItems: 'center'
      }
});

export { shared_styles }