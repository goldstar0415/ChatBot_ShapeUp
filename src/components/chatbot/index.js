import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} from 'react-native';

import {GiftedChat, Actions, Bubble} from 'react-native-gifted-chat';
import ApiAi from "react-native-api-ai";

import styles from './styles.js';

class Chatbot extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      loadEarlier: false,
      typingText: null,
      isLoadingEarlier: false,
      footerType:"",
      footerHeight: 60,
    };

    ApiAi.setConfiguration(
      "5889f1b2dc5246228141b87af965fa7e", ApiAi.LANG_ENGLISH
    );

    this._isMounted = false;
    this.onSend = this.onSend.bind(this);
    this.onReceive = this.onReceive.bind(this);
    this.renderBubble = this.renderBubble.bind(this);
    this.renderFooter = this.renderFooter.bind(this);
    this.onLoadEarlier = this.onLoadEarlier.bind(this);

    this._isAlright = null;
  }

  componentDidMount() {
    this._isMounted = true;
    ApiAi.requestQuery("Get started", result=>{
      var msgtxt = result.result.fulfillment.speech;
      this.setState({
        messages:[{
          _id: Math.round(Math.random() * 1000000),
          text: msgtxt,
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'Shapeup',
            // avatar: '../../resources/images/logo.png'
          },
        }],
        footerType:"welcome",
        footerHeight: 60,
      })
    }, error=>{
      console.log(error);
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  onLoadEarlier() {
    this.setState((previousState) => {
      return {
        isLoadingEarlier: true,
      };
    });

    setTimeout(() => {
      if (this._isMounted === true) {
        this.setState((previousState) => {
          return {
            messages: GiftedChat.prepend(previousState.messages, [
              {
                _id: Math.round(Math.random() * 1000000),
                text: 'It uses the same design as React, letting you compose a rich mobile UI from declarative components https://facebook.github.io/react-native/',
                createdAt: new Date(Date.UTC(2016, 7, 30, 17, 20, 0)),
                user: {
                  _id: 1,
                  name: 'Developer',
                },
              },
              {
                _id: Math.round(Math.random() * 1000000),
                text: 'React Native lets you build mobile apps using only JavaScript',
                createdAt: new Date(Date.UTC(2016, 7, 30, 17, 20, 0)),
                user: {
                  _id: 1,
                  name: 'Developer',
                },
              },
            ]),
            loadEarlier: false,
            isLoadingEarlier: false,
          };
        });
      }
    }, 1000); // simulating network
  }

  onSend(messages = []) {
    this.setState((previousState) => {
      return {
        messages: GiftedChat.append(previousState.messages, messages),
      };
    });

    // for demo purpose
    this.answer(messages);
  }

  answer(messages) {
    if (messages.length > 0) {
      if ((messages[0].image || messages[0].location) || !this._isAlright) {
        this.setState((previousState) => {
          return {
            typingText: 'ShapeUp is typing'
          };
        });
      }
    }

    setTimeout(() => {
      if (this._isMounted === true) {
        if (messages.length > 0) {
          this.onReceive(messages[0].text);
        }
      }

      this.setState((previousState) => {
        return {
          typingText: null,
        };
      });
    }, 1000);
  }

  onReceive(text) {
    ApiAi.requestQuery(text, result=>{
      var msgtxt = result.result.fulfillment.speech;
      var footer = result.result.action;
      this.setState((previousState) => {
        return {
          messages: GiftedChat.append(previousState.messages, {
            _id: Math.round(Math.random() * 1000000),
            text: msgtxt,
            createdAt: new Date(),
            user: {
              _id: 2,
              name: 'ShapeUp',
              // avatar: 'https://facebook.github.io/react/img/logo_og.png',
            },
          }),
          footerType: footer
        };
      });
    }, error=>{
      console.log(error);
    });  
  }

  sendCustomMsg(txt){
    
  }

  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            backgroundColor: '#f0f0f0',
          }
        }}
      />
    );
  }

  renderFooter(props) {
    console.log(this.state.footerType)
    switch (this.state.footerType){
      case 'welcome':
        return (
          <View style={styles.footerContainer}>
            <View style={styles.readyContainer}>
              <TouchableOpacity style={styles.readyButtonContainer} onPress={()=>this.onSend([{text:"Yes", user:{_id: 1},_id: Math.round(Math.random() * 1000000),createdAt: new Date()}])}>
                <Text style={styles.ready}>Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      case 'edbrooks.ready':
        <View style={styles.footerContainer}>
          <View style={styles.readyContainer}>
            <TouchableOpacity style={styles.readyButtonContainer} onPress={()=>this.onSend([{text:"Yes", user:{_id: 1},_id: Math.round(Math.random() * 1000000),createdAt: new Date()}])}>
              <Text style={styles.ready}>Name</Text>
            </TouchableOpacity>
          </View>
        </View>
      default:
        return null;
    }
  }

  render() {
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={this.onSend}
        user={{
          _id: 1, // sent messages should have same user._id
        }}
        minInputToolbarHeight={this.state.footerHeight}
        renderAvatarOnTop = {true}
        renderComposer={this.renderFooter}
      />
    );
  }
}

export default Chatbot;
