import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';
import {
  Scene,
  Router,
  Actions,
  Reducer,
  ActionConst
} from 'react-native-router-flux';

import Start from './start';
import Chatbot from './chatbot';
import Login from './login';

import styles from './styles.js';

class App extends Component {
  render() {
    return (
      <Router >
        <Scene key="root">
          <Scene initial key="start" hideNavBar component={Start}/>
          <Scene key="chatbot" component={Chatbot} navigationBarStyle={styles.navBar} titleStyle={styles.navTitle} leftButtonIconStyle={styles.leftButton} title="Chatbot"/>
          <Scene key="login" hideNavBar component={Login}/>
        </Scene>
      </Router>
    );
  }
}

export default App;
