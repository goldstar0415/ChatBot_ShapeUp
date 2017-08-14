'use strict'

import {
  StyleSheet,
  Dimensions
} from 'react-native';

var styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#00A0DC',
  },
  logo: {
    marginTop: Dimensions.get('window').height/2*0.35
  },
  welcome: {
    fontSize: 40,
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold'
  },
  bottomContainer: {
    position: 'absolute',
    flexDirection: 'column',
    bottom: 80
  },
  startContainer: {
    backgroundColor: '#1bbacd',
    width: Dimensions.get('window').width*0.8,
    height: 45,
    borderRadius: 10,
    flexDirection: 'row'
  },
  start: {
    textAlign: 'center',
    alignSelf: 'center',
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
    width: Dimensions.get('window').width*0.8
  },
  login: {
    textAlign: 'center',
    color: 'white',
    marginTop: 15,
    fontSize: 15,
    textDecorationLine: 'underline',
    textDecorationColor: 'white',
    paddingBottom: 3
  },
});

export default styles;
