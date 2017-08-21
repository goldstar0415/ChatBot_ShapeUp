import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Animated,
  Image,
  Platform,
  Easing
} from 'react-native';

import {GiftedChat, Actions, Bubble, InputToolbar} from 'react-native-gifted-chat';
import ApiAi from "react-native-api-ai";
import Modal from 'react-native-modal';
var ImagePicker = require('react-native-image-picker');
import RNFetchBlob from 'react-native-fetch-blob'

import * as firebase from 'firebase';

import styles from './styles.js';

const trades = ["Carpenter", "Taper"];
const years = ["1-5 years", "5-10 years", "10+ years", "20+ years"]
const skills = ["Acoustical ceilings", "Woodwork", "Drywall", "House framing", "Hardware", "Concrete foams"]
const locations = ["New York", "New Jersey", "Connecticut"]
const travels = ["New Jersey", "Connecticut"]

const Blob = RNFetchBlob.polyfill.Blob
const fs = RNFetchBlob.fs
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest
window.Blob = Blob

var config = {
  apiKey: "AIzaSyDxfAF78Du5KUIsc2ttXJReJyJ5ocPFH7c",
  authDomain: "edbrooks-2eebf.firebaseapp.com",
  databaseURL: "https://edbrooks-2eebf.firebaseio.com",
  projectId: "edbrooks-2eebf",
  storageBucket: "edbrooks-2eebf.appspot.com",
  messagingSenderId: "1091522655846"
};
let firebaseApp = firebase.initializeApp(config);

class Chatbot extends Component {
  constructor(props) {
    super(props);
    this.spinValue = new Animated.Value(0)
    this.state = {
      messages: [],
      footerType:"",
      firstname: "",
      lastname: "",
      union: false,
      trade: "",
      email: "",
      password: "",
      confirm: "",
      lastposition: "",
      skills:[],
      zipcode: "",
      firstchoice: "",
      travels: [],
      animation: new Animated.Value(-50),
      passwordVisible: false,
      profileVisible: false,
      logoVisible: false,
      errorText: "",
      phone: "",
      years: "",
      city: "",
      avatar: require('../../resources/images/user.png')
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

  sendMessage(txt) {
    this.setState((previousState) => {
      return {
        messages: GiftedChat.append(previousState.messages, {
          _id: Math.round(Math.random() * 1000000),
          text: txt,
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'Pam',
            avatar: require('../../resources/images/logo.png'),
          },
        }),
      };
    });
  }

  componentDidMount() {
    this._isMounted = true;
    ApiAi.requestQuery("Get started", result=>{
      var msgtxt = result.result.fulfillment.speech;
      this.sendMessage(msgtxt);
      this.setState({
        footerType:"welcome",
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
  setFirstNameText(event) {
    let firstname = event.nativeEvent.text;
    this.setState({firstname})
  }
  
  setLastNameText(event) {
    let lastname = event.nativeEvent.text;
    this.setState({lastname})
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

  setConfirmText(event) {
    let confirm = event.nativeEvent.text;
    this.setState({confirm})
  }

  setLastPositionText(event) {
    let lastposition = event.nativeEvent.text;
    this.setState({lastposition})
  }

  setPhoneText(event) {
    let phone = event.nativeEvent.text;
    this.setState({phone})
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

  addTravel (travel) {
    this.setState({
      travels: [ ...this.state.travels, travel ]
    })
  }

  removeTravel (travel) {
    this.setState({
      travels: this.state.travels.filter(item => item !== travel)
    })
  }

  //Create Firebase Account and Store user data
  async signUp() {
    this.setState({
      logoVisible: true
    })
    this.spin()
    console.log("******* Account Info *********", this.state.email, this.state.password)
    try {
      await firebaseApp.auth().createUserWithEmailAndPassword(this.state.email, this.state.password).then((res)=>{
        console.log("****** User ID *******",res.uid)
        this.setState({
          userId: res.uid
        })
        const userDataPath = "/users/"+res.uid
        firebaseApp.database().ref(userDataPath).set({
          firstname: this.state.firstname,
          lastname: this.state.lastname,
          email: this.state.email,
          trade: this.state.trade,
          union: this.state.union,
          phone: this.state.phone,
          city: this.state.lastposition,
          skills: this.state.skills,
          experiences: this.state.years,
          travels: this.state.travels
        }).then((res)=>{
          this.sendMessage("Notice you don’t have a photo yet. Click user avatar on dialog and upload it now. If you've done once or want to skip it, click CONNECT button")
          this.setState({
            logoVisible: false,
          })
          setTimeout(()=>{
            this.setState({
              profileVisible:true
            })
          }, 1000)
        })
      });
      console.log("Account created")
    } catch (error) {
      console.log(error.toString())
    }
  }

  uploadImage(uri, mime = 'application/octet-stream') {
    return new Promise((resolve, reject) => {
      const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri
      let uploadBlob = null

      const imageRef = firebaseApp.storage().ref('images').child(this.state.userId+".png")

      fs.readFile(uploadUri, 'base64')
        .then((data) => {
          return Blob.build(data, { type: `${mime};BASE64` })
        })
        .then((blob) => {
          uploadBlob = blob
          return imageRef.put(blob, { contentType: mime })
        })
        .then(() => {
          uploadBlob.close()
          return imageRef.getDownloadURL()
        })
        .then((url) => {
          resolve(url)
        })
        .catch((error) => {
          reject(error)
      })
    })
  }

  //Choose Image from Camera or Library
  chooseAvatar() {
    var options = {
      title: 'Select Avatar',
      storageOptions:{
        skipBackup: true,
        path: 'images'
      }
    }

    ImagePicker.showImagePicker(options, (response)=>{
      if (!response.error && !response.didCancel) {
        this.uploadImage(response.uri)
        .then(url => { this.setState({avatar: {uri:url}}) })
        .catch(error => console.log(error))
      }
    })
  }

  // Spin logo
  spin () {
    this.spinValue.setValue(0)
    Animated.timing(
      this.spinValue,
      {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear
      }
    ).start(() => this.spin())
  }

  // API.ai integration
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
    if (this._isMounted === true) {
      if (messages.length > 0) {
        this.onReceive(messages[0].text);
      }
    }
  }

  onReceive(text) {
    var _this = this
    var tmp = text
    if (this.state.footerType == "edbrooks.ready"){
      text = "My first name is " + text;
    } else if (this.state.footerType == "edbrooks.firstname") {
      text = "My last name is " + text;
    } else if (this.state.footerType == "edbrooks.email") {
      this.setState({
        trade: text
      })
      text = "my trade is " + text;
    } else if (this.state.footerType == "edbrooks.trade") {
      this.setState({
        union: text=="Yes"
      })
      text = (text=="Yes")?text+", I am on it":text+", I am not on it";
    } else if (this.state.footerType == "edbrooks.union") {
      this.setState({
        years: text
      })
      text = "I have " + text + " of experiences"
    } else if (this.state.footerType == "edbrooks.experiences") {
      text = "My skills are " + text
    } else if (this.state.footerType == "edbrooks.password") {
      text = text=="Yes"?text+", I am interested in":text+", I am not interested in"
    } else if (this.state.footerType == "edbrooks.asklocation") {
      this.setState({
        city: text
      })
      text = "My first choice is " + text + " City"
    } else if (this.state.footerType == "edbrooks.firstchoice") {
      text = text=="Yes"?"Yes, I'll travel":"No, travel"
    } else if (this.state.footerType == 'edbrooks.skip') {
      text = (text=="Yes")?"Yes, I skip it":"Yes, I am interested in";
    } else if (this.state.footerType == 'edbrooks.phone') {
      text = "My phone is " + text;
    } else if (this.state.footerType == 'edbrooks.travel') {
      text = "I'd like to go to " + text;
    }

    if (text == "Yes") {
      this.sendMessage("Great, let’s get started so you can get back to work 😊")
    }

    if (text == "Yes, I am on it") {
      this.sendMessage("Nice! Just a few more questions, almost done.")
    }

    if (text == "No, I am not on it") {
      this.sendMessage("Ok, just a few more questions, almost done.")
    }

    if (this.state.footerType == 'edbrooks.email') {
      this.sendMessage("Cool!")
    }

    if (text == "Yes, I skip it") {
      this.sendMessage("Ok, skipped!")
    }
    
    if (this.state.footerType == 'edbrooks.experiences') {
      this.sendMessage("Thanks for your generous feedback so far. You’re going to have a great profile!")
    }

    if (text == "No") {
      this.sendMessage("No problem, I’ll wait until you are ready.")
    }else if (this.state.footerType == "edbrooks.skillset") {
      this.sendMessage(`Awesome, we know ${text}! Let’s create a secure password. Go ahead, I’m not looking…`)
      this.setState({
        passwordVisible: true
      })
    }else{
      ApiAi.requestQuery(text, result=>{
        var msgtxt = result.result.fulfillment.speech;
        var footer = result.result.action;
        this.sendMessage(msgtxt);
        this.setState({
          footerType: footer
        })
        if (this.state.footerType == 'edbrooks.profile') {
          this.signUp();
        }
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
  }

  sendCustomMsg(txt){
    var _this = this
    var offset = -50
    switch(this.state.footerType){
      case 'edbrooks.union':
        offset = -116
        break
      case 'edbrooks.experiences':
        offset = -160
        break
      case 'edbrooks.email':
        offset = -76
        break
      case 'edbrooks.asklocation':
        offset = -76;
        break;
      case 'edbrooks.travel':
        offset = -76;
        break;
      default:
        offset = -50
    }

    if (txt == "No" && this.state.footerType=="welcome") {
      var messages = [];
      var message = {};
      message.text = txt;
      message.user = {_id: 1};
      message._id = Math.round(Math.random() * 1000000);
      message.createdAt = new Date();
      messages.push(message);
      _this.onSend(messages);
    } else {
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
  }

  confirmPassword() {
    if (this.state.password == ""){
      this.setState({
        errorText: "Please enter your password"
      });
      return
    }
    if (this.state.confirm == "") {
      this.setState({
        errorText:"Please confirm your password"
      });
      return;
    }
    if (this.state.password.length<6) {
      this.setState({
        errorText:"Password should be at least 6 characters"
      });
      return;
    }
    if (this.state.password != this.state.confirm) {
      this.setState({
        errorText: "Password is not mactched"
      });
      return;
    }
    this.setState({
      passwordVisible: false
    })
    ApiAi.requestQuery("My password is "+this.state.password, result=>{
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
                name: 'Pam',
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

  // Render Custom Footer View
  renderFooter(props) {

    switch (this.state.footerType){
      case 'welcome':
        return (
          <Animated.View style={[styles.footerContainer, {marginBottom: this.state.animation}]}>
            <TouchableOpacity style={styles.activeButtonContainer} onPress={()=>this.sendCustomMsg("Yes")}>
              <Text style={styles.ready}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.activeButtonContainer} onPress={()=>this.sendCustomMsg("No")}>
              <Text style={styles.ready}>No</Text>
            </TouchableOpacity>
          </Animated.View>
        );
      case 'edbrooks.ready':
        return (
          <Animated.View style={[styles.footerContainer, {marginBottom: this.state.animation}]}>
            <TextInput 
              placeholder="First Name" 
              style={styles.textInputContainer} 
              onChange={this.setFirstNameText.bind(this)}
              value={this.state.firstname}
            />
            {
              this.state.firstname!=""?(
                <TouchableOpacity style={styles.activeButtonContainer} onPress={()=>this.sendCustomMsg(this.state.firstname)}>
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
      case 'edbrooks.firstname':
        return (
          <Animated.View style={[styles.footerContainer, {marginBottom: this.state.animation}]}>
            <TextInput 
              placeholder="Last Name" 
              style={styles.textInputContainer} 
              onChange={this.setLastNameText.bind(this)}
              value={this.state.lastname}
            />
            {
              this.state.lastname!=""?(
                <TouchableOpacity style={styles.activeButtonContainer} onPress={()=>this.sendCustomMsg(this.state.lastname)}>
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
      case 'edbrooks.lastname':
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
      case 'edbrooks.password':
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
      case 'edbrooks.skip':
        return (
          <Animated.View style={[styles.footerContainer, {marginBottom: this.state.animation}]}>
            <TouchableOpacity style={styles.activeButtonContainer} onPress={()=>this.sendCustomMsg("Yes")}>
              <Text style={styles.ready}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.activeButtonContainer} onPress={()=>this.sendCustomMsg("No")}>
              <Text style={styles.ready}>No</Text>
            </TouchableOpacity>
          </Animated.View>
        );
      case 'edbrooks.email':
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
      case 'edbrooks.phone':
        return (
          <Animated.View style={[styles.footerContainer, {marginBottom: this.state.animation}]}>
            <TextInput 
              placeholder="Phone number" 
              style={styles.textInputContainer} 
              onChange={this.setPhoneText.bind(this)} 
              value={this.state.phone}
            />
            {
              this.state.phone!=""?(
                <TouchableOpacity style={styles.activeButtonContainer} onPress={()=>this.sendCustomMsg(this.state.phone)}>
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
      case 'edbrooks.experiences':
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
              placeholder="Recent Company" 
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
      case 'edbrooks.travel':
        return (
          <Animated.View style={[styles.frameContainer, {marginBottom: this.state.animation}]}>
            <TouchableOpacity onPress={()=>this.state.travels.length>0?this.sendCustomMsg(this.state.travels.join(",")):null}>
              <Image source={require('../../resources/images/check.png')} style={styles.checkBtn}/>
            </TouchableOpacity>
            <View style={styles.multiButtonsContainer}>
            {
              travels.map((travel, i)=>
                this.state.travels.find(selectedItem => travel === selectedItem)?(
                  <TouchableOpacity key={i} style={styles.activeMultiButtonContainer} onPress={()=>this.removeTravel(travel)}>
                    <Text style={styles.multiButton}>{travel}</Text>
                  </TouchableOpacity>
                ):(
                   <TouchableOpacity key={i} style={styles.multiButtonContainer} onPress={()=>this.addTravel(travel)}>
                    <Text style={styles.multiButton}>{travel}</Text>
                  </TouchableOpacity>
                )
              )
            }
            </View>
          </Animated.View>
        )
      case 'edbrooks.firstchoice':
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
      case 'edbrooks.asklocation':
        return (
          <Animated.View style={[styles.frameContainer, {marginBottom: this.state.animation}]}>
            <View style={styles.multiButtonsContainer}>
            {
              locations.map((location, i)=>
                <TouchableOpacity key={i} style={styles.multiButtonContainer} onPress={()=>this.sendCustomMsg(location)}>
                  <Text style={styles.multiButton}>{location}</Text>
                </TouchableOpacity>
              )
            }
            </View>
          </Animated.View>
        )
      default:
        return null;
    }
  }

  render() {
    const extra = (this.state.travels.length>0)? `However Ed’s willing to travel from ${this.state.city} to ${this.state.travels}.`:"";
    const info = `${this.state.firstname} has developed skills over ${this.state.years} within companies like ${this.state.lastposition}, where he recently worked. ${this.state.firstname} specializes in ${this.state.skills}. Seeking a position within ${this.state.city} City. ${extra}`;
    const spin = this.spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg']
    })
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

        <Modal isVisible={this.state.passwordVisible}>
          <View style={styles.passwordDialog}>
            <Text style={styles.passwordNotice}>Pleaes enter your password</Text>
            <View style={{flexDirection: 'row'}}>
              <TextInput 
                placeholder="Password" 
                style={styles.passwordInput}
                onChange={this.setPasswordText.bind(this)} 
                onFocus={()=>{
                  this.setState({
                    errorText: ""
                  })
                }}
                value={this.state.password}
                secureTextEntry={true}/> 
            </View>
            <View style={{flexDirection: 'row'}}>
              <TextInput 
                placeholder="Confirmation" 
                style={styles.confirmInput}
                onChange={this.setConfirmText.bind(this)}
                onFocus={()=>{
                  this.setState({
                    errorText: ""
                  })
                }}
                value={this.state.confirm}
                secureTextEntry={true}/>
            </View>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.infoLabel}>{this.state.errorText}</Text>
            </View>
            <TouchableOpacity onPress={()=>this.confirmPassword()}>
              <Text style={styles.okButton}>OK</Text>
            </TouchableOpacity>
          </View>
        </Modal>

        <Modal isVisible={this.state.profileVisible}>
          <View style={styles.passwordDialog}>
            <TouchableOpacity onPress={()=>this.chooseAvatar()}>
              <Image source={this.state.avatar} style={styles.userBtn}/> 
            </TouchableOpacity>
            <Text style={styles.username}>{this.state.firstname} {this.state.lastname}</Text>
            {
              this.state.union?<Text style={styles.union}>Union {this.state.trade}</Text>:null
            }
            <Text style={styles.userinfo}>{info}</Text>
            <TouchableOpacity style={styles.connectContainer} onPress={()=>this.confirmPassword()}>
              <Text style={styles.connect}>CONNECT</Text>
            </TouchableOpacity>
          </View>
        </Modal>

        <Modal isVisible={this.state.logoVisible}>
          <View  style={{justifyContent: 'center', alignItems:'center'}}>
            <Animated.Image
              style={{
                width: 40,
                height: 50,
                transform: [{rotate: spin}] }}
                source={require('../../resources/images/logo.png')}/>
          </View>
        </Modal>   
      </View>
    );
  }
}

export default Chatbot;
