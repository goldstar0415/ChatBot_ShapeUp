'use strict'

import {
  StyleSheet,
  Dimensions
} from 'react-native';

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  footerContainer: {
    backgroundColor: 'white',
  },
  readyContainer:{
    justifyContent: 'center',
    height: 60,
  },
  readyButtonContainer:{
    position: 'absolute',
    height: 30,
    width: 60,
    borderRadius: 5,
    backgroundColor: '#00A0DC',
    flexDirection: 'column',
    justifyContent: 'center',
    left: Dimensions.get('window').width - 70
  },
  ready: {
    color: 'white',
    textAlign: 'center',
    alignSelf: 'center',
    fontSize: 17,
  }
});

export default styles;
