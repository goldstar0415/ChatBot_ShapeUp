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
    fontSize: 14,
    paddingLeft: 8
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
  },
  frameContainer: {
    backgroundColor: 'white',
  },
  multiButtonsContainer: {
    justifyContent: 'flex-end',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 18,
    marginTop: 18
  },
  multiButtonContainer:{
    height: 30,
    borderRadius: 5,
    backgroundColor: '#00A0DC',
    flexDirection: 'row',
    justifyContent: 'center',
    marginRight: 5,
    marginBottom:5,
    marginTop: 5
  },
  activeMultiButtonContainer:{
    height: 30,
    borderRadius: 5,
    backgroundColor: 'red',
    flexDirection: 'row',
    justifyContent: 'center',
    marginRight: 5,
    marginBottom:5,
    marginTop: 5
  },
  multiButton: {
    color: 'white',
    textAlign: 'center',
    alignSelf: 'center',
    fontSize: 17,
    marginRight: 10,
    marginLeft: 10
  },
  checkBtn:{
    position: 'absolute',
    width: 40,
    height: 40,
    right: 10,
    top: -20
  }
});

export default styles;
