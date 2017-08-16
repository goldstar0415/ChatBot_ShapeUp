'use strict'

import {
  StyleSheet,
  Dimensions
} from 'react-native';

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor:'gray'
  },
  messageContainer:{
    flex: 1
  },
  footerContainer: {
    backgroundColor: 'white',
    justifyContent: 'flex-end',
    flexDirection: 'row'
  },
  textInputContainer: {
    flex: 1,
    margin: 10,
    borderRadius: 5,
    borderColor: 'gray',
    borderWidth: 1,
    fontSize: 14
  },
  ButtonContainer:{
    height: 30,
    width: 60,
    borderRadius: 5,
    backgroundColor: 'gray',
    flexDirection: 'column',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 10,
    marginRight: 10
  },
  activeButtonContainer:{
    height: 30,
    width: 60,
    borderRadius: 5,
    backgroundColor: '#00A0DC',
    flexDirection: 'column',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 10,
    marginRight: 10

  },
  ready: {
    color: 'white',
    textAlign: 'center',
    alignSelf: 'center',
    fontSize: 17,
  }
});

export default styles;
