import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity
} from 'react-native';
import { Actions as NavigationActions } from 'react-native-router-flux'

import styles from './styles.js';

class Start extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Image source={require('../../resources/images/logo.png')} style={styles.logo}/>
        <Text style={styles.welcome}>
          ShapeUp
        </Text>
        <View style={styles.bottomContainer}>
          <TouchableOpacity style={styles.startContainer} onPress={()=>NavigationActions.chatbot()}>
            <Text style={styles.start}>START FREE</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>NavigationActions.login()}>
            <Text style={styles.login}>Log in</Text> 
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default Start;
