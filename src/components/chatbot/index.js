import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Animated
} from 'react-native';

import {GiftedChat, Actions, Bubble, InputToolbar} from 'react-native-gifted-chat';
import ApiAi from "react-native-api-ai";

import * as Animatable from 'react-native-animatable';

import styles from './styles.js';

const trades = ["Carpenter"];
const years = ["3+", "5+", "10+", "20+"]
const skills = ["Acoustical ceilings, Woodwork, Drywall, House framing, Hardware, Concrete foams"]

class Chatbot extends Component {
  constructor(props) {
    super(props);
    this.animation = new Animated.Value(0);
    this.state = {
      messages: [],
      loadEarlier: false,
      typingText: null,
      isLoadingEarlier: false,
      footerType:"",
      firstname: "",
      lastname: "",
      name: "",
      email: "",
      password: ""
    };

    ApiAi.setConfiguration(
      "5889f1b2dc5246228141b87af965fa7e", ApiAi.LANG_ENGLISH
    );

    this._isMounted = false;
    this.onSend = this.onSend.bind(this);
    this.onReceive = this.onReceive.bind(this);
    this.renderFooter = this.renderFooter.bind(this);

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

  //Store and bind Data
  setNameText(event) {
    let name = event.nativeEvent.text;
    this.setState({name})
  }

  validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  setEmailText(event) {
    let email = event.nativeEvent.text;
    this.setState({email})
  }

  setPasswordText(event) {
    let password = event.nativeEvent.text;
    this.setState({password})
  }

  // API.ai integration
  onSend(messages = []) {
    var temp = messages;
    if (this.state.footerType == "edbrooks.email") {
      temp[0].text = Array(messages[0].text.length+1).join("*");
      this.setState((previousState) => {
        return {
          messages: GiftedChat.append(previousState.messages, temp),
        };
      });
    } else {
      this.setState((previousState) => {
        return {
          messages: GiftedChat.append(previousState.messages, messages),
        };
      });
    }    

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
    if (this.state.footerType == "edbrooks.email"){
      text = "My password is " + text;
    }
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
    var messages = [];
    var message = {};
    message.text = txt;
    message.user = {_id: 1};
    message._id = Math.round(Math.random() * 1000000);
    message.createdAt = new Date();
    messages.push(message);
    this.onSend(messages);
  }

  // Render Custom Footer View
  renderFooter(props) {
    console.log(this.state.footerType)
    const move_Y = this.animation.interpolate({
      inputRange: [0,30],
      outputRange:[0, 60]
    });
    switch (this.state.footerType){
      case 'welcome':
        return (
          <Animated.View style={[styles.footerContainer, {transform: [{
            translateY: move_Y
          }]}]}>
            <TouchableOpacity style={styles.activeButtonContainer} onPress={()=>this.sendCustomMsg("Yes")}>
              <Text style={styles.ready}>Yes</Text>
            </TouchableOpacity>
          </Animated.View>
        );
      case 'edbrooks.ready':
        return (
          <Animated.View style={[styles.footerContainer, {transform: [{
            translateY: move_Y
          }]}]}>
            <TextInput 
              placeholder="Name" 
              style={styles.textInputContainer} 
              onChange={this.setNameText.bind(this)}
              value={this.state.name}
            />
            {
              this.state.name!=""?(
                <TouchableOpacity style={styles.activeButtonContainer} onPress={()=>this.sendCustomMsg(this.state.name)}>
                  <Text style={styles.ready}>Send</Text>
                </TouchableOpacity>
              ):(
                <TouchableOpacity style={styles.ButtonContainer}>
                  <Text style={styles.ready}>Send</Text>
                </TouchableOpacity>
              )
            }
          </Animated.View>
        )
      case 'edbrooks.name':
        return (
          <Animated.View style={[styles.footerContainer, {transform: [{
            translateY: move_Y
          }]}]}>
            <TextInput 
              placeholder="Email" 
              style={styles.textInputContainer} 
              onChange={this.setEmailText.bind(this)} 
              value={this.state.email}
              keyboardType='email-address'
            />
            {
              this.validateEmail(this.state.email)?(
                <TouchableOpacity style={styles.activeButtonContainer} onPress={()=>this.sendCustomMsg(this.state.email)}>
                  <Text style={styles.ready}>Send</Text>
                </TouchableOpacity>
              ):(
                <TouchableOpacity style={styles.ButtonContainer}>
                  <Text style={styles.ready}>Send</Text>
                </TouchableOpacity>
              )
            }
          </Animated.View>
        )
      case 'edbrooks.email':
        return (
          <Animated.View style={[styles.footerContainer, {transform: [{
            translateY: move_Y
          }]}]}>
            <TextInput 
              placeholder="Password" 
              style={styles.textInputContainer} 
              onChange={this.setPasswordText.bind(this)} 
              value={this.state.password}
              secureTextEntry={true}
            />
            {
              this.state.password!="" && this.state.password.length>5?(
                <TouchableOpacity style={styles.activeButtonContainer} onPress={()=>this.sendCustomMsg(this.state.password)}>
                  <Text style={styles.ready}>Send</Text>
                </TouchableOpacity>
              ):(
                <TouchableOpacity style={styles.ButtonContainer}>
                  <Text style={styles.ready}>Send</Text>
                </TouchableOpacity>
              )
            }
          </Animated.View>
        )
      default:
        return null;
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <GiftedChat
          style={styles.messageContainer}
          messages={this.state.messages}
          onSend={this.onSend}
          user={{
            _id: 1, // sent messages should have same user._id
          }}
          minInputToolbarHeight={null}
          renderAvatarOnTop = {true}
          renderComposer={null}
        />
        {this.renderFooter()}
      </View>
    );
  }
}

export default Chatbot;
