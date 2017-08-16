import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Animated,
  Image
} from 'react-native';

import {GiftedChat, Actions, Bubble, InputToolbar} from 'react-native-gifted-chat';
import ApiAi from "react-native-api-ai";

import * as Animatable from 'react-native-animatable';

import styles from './styles.js';

const trades = ["Carpenter"];
const years = ["3+", "5+", "10+", "20+"]
const skills = ["Acoustical ceilings", "Woodwork", "Drywall", "House framing", "Hardware", "Concrete foams"]

class Chatbot extends Component {
  constructor(props) {
    super(props);
    // this.animation = new Animated.Value(0);
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
      password: "",
      lastposition: "",
      skills:[],
      zipcode: "",
      firstchoice: "",
      travel: "",
      animation: new Animated.Value(-50)
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
    Animated.timing(
      this.state.animation,{
        toValue: 0,
        duration: 1000
      }
    ).start();
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

  setLastPositionText(event) {
    let lastposition = event.nativeEvent.text;
    this.setState({lastposition})
  }

  setZipcodeText(event) {
    let zipcode = event.nativeEvent.text;
    this.setState({zipcode})
  }

  setFirstChoiceText(event) {
    let firstchoice = event.nativeEvent.text;
    this.setState({firstchoice})
  }

  setTravelText(event) {
    let travel = event.nativeEvent.text;
    this.setState({travel})
  }

  addSkill (skill) {
    this.setState({
      skills: [ ...this.state.skills, skill ]
    })
  }

  removeSkill (skill) {
    this.setState({
      skills: this.state.skills.filter(item => item !== skill)
    })
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
    } else if (this.state.footerType == "edbrooks.password") {
      text = "my trade is " + text;
    } else if (this.state.footerType == "edbrooks.trade") {
      text = (text=="Yes")?text+", I am on it":text+", I am not on it";
    } else if (this.state.footerType == "edbrooks.union") {
      text = "I have " + text + " years of experiences"
    } else if (this.state.footerType == "edbrooks.experiences") {
      text = "I worked on " + text
    } else if (this.state.footerType == "edbrooks.position") {
      text = "My skills are " + text
    } else if (this.state.footerType == "edbrooks.skillset") {
      text = "My zipcode is " + text
    } else if (this.state.footerType == "edbrooks.zip") {
      text = "My first choice is " + text + " City"
    } else if (this.state.footerType == "edbrooks.firstchoice") {
      text = "I'd like to go to " + text
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
      Animated.timing(
        this.state.animation,{
          toValue: 0,
          duration: 1000
        }
      ).start(); 
    }, error=>{
      console.log(error);
    });
  }

  sendCustomMsg(txt){
    var _this = this
    var offset = -50
    console.log("****** Footer ****  => ", this.state.footerType)
    switch(this.state.footerType){
      case 'edbrooks.union':
        offset = -76
        break
      case 'edbrooks.position':
        offset = -176
        break
      case 'edbrooks.password':
        offset = -76
        break
      default:
        offset = -50
    }
    Animated.timing(
      this.state.animation,{
        toValue: offset,
        duration: 1000
      }
    ).start(function onComplete(){
      var messages = [];
      var message = {};
      message.text = txt;
      message.user = {_id: 1};
      message._id = Math.round(Math.random() * 1000000);
      message.createdAt = new Date();
      messages.push(message);
      _this.onSend(messages);
    });
  }

  // Render Custom Footer View
  renderFooter(props) {

    switch (this.state.footerType){
      case 'welcome':
        return (
          <Animated.View style={[styles.footerContainer, {marginBottom: this.state.animation}]}>
            <TouchableOpacity style={styles.activeButtonContainer} onPress={()=>this.sendCustomMsg("Yes")}>
              <Text style={styles.ready}>Yes</Text>
            </TouchableOpacity>
          </Animated.View>
        );
      case 'edbrooks.ready':
        return (
          <Animated.View style={[styles.footerContainer, {marginBottom: this.state.animation}]}>
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
          <Animated.View style={[styles.footerContainer, {marginBottom: this.state.animation}]}>
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
          <Animated.View style={[styles.footerContainer, {marginBottom: this.state.animation}]}>
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
      case 'edbrooks.password':
        return (
          <Animated.View style={[styles.frameContainer, {marginBottom: this.state.animation}]}>
            <View style={styles.multiButtonsContainer}>
            {
              trades.map((trade, i)=>
                <TouchableOpacity key={i} style={styles.multiButtonContainer} onPress={()=>this.sendCustomMsg(trade)}>
                  <Text style={styles.multiButton}>{trade}</Text>
                </TouchableOpacity>
              )
            }
            </View>
          </Animated.View>
        )
      case 'edbrooks.trade':
        return (
          <Animated.View style={[styles.footerContainer, {marginBottom: this.state.animation}]}>
            <TouchableOpacity style={styles.activeButtonContainer} onPress={()=>this.sendCustomMsg("Yes")}>
              <Text style={styles.ready}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.activeButtonContainer} onPress={()=>this.sendCustomMsg("No")}>
              <Text style={styles.ready}>No</Text>
            </TouchableOpacity>
          </Animated.View>
        )
      case 'edbrooks.union':
        return (
          <Animated.View style={[styles.frameContainer, {marginBottom: this.state.animation}]}>
            <View style={styles.multiButtonsContainer}>
            {
              years.map((year, i)=>
                <TouchableOpacity key={i} style={styles.multiButtonContainer} onPress={()=>this.sendCustomMsg(year)}>
                  <Text style={styles.multiButton}>{year}</Text>
                </TouchableOpacity>
              )
            }
            </View>
          </Animated.View>
        )
      case 'edbrooks.experiences':
        return (
          <Animated.View style={[styles.footerContainer, {marginBottom: this.state.animation}]}>
            <TextInput 
              placeholder="Recent Position" 
              style={styles.textInputContainer} 
              onChange={this.setLastPositionText.bind(this)} 
              value={this.state.lastposition}
            />
            {
              this.state.lastposition!=""?(
                <TouchableOpacity style={styles.activeButtonContainer} onPress={()=>this.sendCustomMsg(this.state.lastposition)}>
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
      case 'edbrooks.position':
        return (
          <Animated.View style={[styles.frameContainer, {marginBottom: this.state.animation}]}>
            <TouchableOpacity onPress={()=>this.state.skills.length>0?this.sendCustomMsg(this.state.skills.join(",")):null}>
              <Image source={require('../../resources/images/check.png')} style={styles.checkBtn}/>
            </TouchableOpacity>
            <View style={styles.multiButtonsContainer}>
            {
              skills.map((skill, i)=>
                this.state.skills.find(selectedItem => skill === selectedItem)?(
                  <TouchableOpacity key={i} style={styles.activeMultiButtonContainer} onPress={()=>this.removeSkill(skill)}>
                    <Text style={styles.multiButton}>{skill}</Text>
                  </TouchableOpacity>
                ):(
                   <TouchableOpacity key={i} style={styles.multiButtonContainer} onPress={()=>this.addSkill(skill)}>
                    <Text style={styles.multiButton}>{skill}</Text>
                  </TouchableOpacity>
                )
              )
            }
            </View>
          </Animated.View>
        )
      case 'edbrooks.skillset':
        return (
          <Animated.View style={[styles.footerContainer, {marginBottom: this.state.animation}]}>
            <TextInput 
              placeholder="Zipcode" 
              style={styles.textInputContainer} 
              onChange={this.setZipcodeText.bind(this)} 
              value={this.state.zipcode}
            />
            {
              this.state.zipcode!=""?(
                <TouchableOpacity style={styles.activeButtonContainer} onPress={()=>this.sendCustomMsg(this.state.zipcode)}>
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
      case 'edbrooks.zip':
        return (
          <Animated.View style={[styles.footerContainer, {marginBottom: this.state.animation}]}>
            <TextInput 
              placeholder="First choice" 
              style={styles.textInputContainer} 
              onChange={this.setFirstChoiceText.bind(this)} 
              value={this.state.firstchoice}
            />
            {
              this.state.firstchoice!=""?(
                <TouchableOpacity style={styles.activeButtonContainer} onPress={()=>this.sendCustomMsg(this.state.firstchoice)}>
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
      case 'edbrooks.firstchoice':
        return (
          <Animated.View style={[styles.footerContainer, {marginBottom: this.state.animation}]}>
            <TextInput 
              placeholder="Travel" 
              style={styles.textInputContainer} 
              onChange={this.setTravelText.bind(this)} 
              value={this.state.travel}
            />
            {
              this.state.travel!=""?(
                <TouchableOpacity style={styles.activeButtonContainer} onPress={()=>this.sendCustomMsg(this.state.travel)}>
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
