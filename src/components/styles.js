'use strict'

import {
  StyleSheet,
  Dimensions,
} from 'react-native';

var styles = StyleSheet.create({
  navBar: {
    backgroundColor: '#00A0DC', // changing navbar color
  },
  navTitle: {
    color: 'white', // changing navbar title color
  },
  routerScene: {
    paddingTop: 50, // some navbar padding to avoid content overlap
  },
  leftButton: {
    tintColor: 'red'
  }
});

export default styles;
