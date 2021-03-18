import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Image, Platform, Text, View, Button, SafeAreaView, Flexbox, ScrollView, Modal, Alert, FlatList, Dimensions, TouchableHighlight  } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { Video, AVPlaybackStatus } from 'expo-av';
import { TouchableOpacity } from 'react-native-gesture-handler';


export default function createAlbumScreen({navigation}) {
  const video = React.useRef(null);
  const [dataSource, setDataSource] = useState([]);
  const [finishLoading, setfinishLoading] = useState(false);
  const [toRender, setToRender] = useState([]);
  const [isPressed, setIsPressed] = useState(false);
  const [pressedTracker, setPressedTracker] = useState({});
  let notPressed;
  const [op, setOp] = useState(0);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      //console.log("I am focused")
      const loadData =  async () => {
        var keys; 
        var tempObj = {};
        var finalArray = [];
        var postObj = {};
        
  
        try {
          keys = await AsyncStorage.getAllKeys()
          //console.log("keys", keys)
        } catch{}
          
        //Loops through all keys and retrieves the attaches URIs
        
        for (var i = 0; i < keys.length; i++) {
          let post = keys[i];
          //console.log("post", post)
          
          try {
            result = await AsyncStorage.getItem(post);
            var content = JSON.parse(result);

            // console.log("fetching trigger warning....", content[2])
            // triggerWarning = content[2];
            // if (triggerWarning != 0){
            //   setModalVisible(true);
            // }
    
  
            if (result != null) {
              tempObj = {
                'id': post,
                "videoURI": content[0],
                "format": content[1],
                "triggerWarning": content[2],
              }
              //Dynamically creates a "toRender" object and stores it in state
              postObj[tempObj.id] = true;
              
              finalArray.push(tempObj);
              }
            
          } catch(e){
            //console.log("ERROR: ", e)
          }
        }
  
        setPressedTracker(postObj);
        notPressed = postObj;
        setToRender(finalArray);
        //console.log("Create Album Data", finalArray);
        //console.log("Not pressed: ", notPressed);
        setfinishLoading(true);
      }
  
      loadData();
    });
    return unsubscribe;
  }, [navigation, pressedTracker]);
  
    const onPressHandler = (item) => {
        if (op == 0){
            setOp(0.5);
        }else{
            setOp(0);
        }
    
        console.log("This is what pressedTracker looks like:\n", pressedTracker[item.id]);
        var tempObj = pressedTracker;
        tempObj[item.id] = !tempObj[item.id]
        setPressedTracker(tempObj);
        console.log("Second change", pressedTracker[item.id]);

    } 
    

  return (
    <SafeAreaView style={styles.container}>
    <ScrollView>
    <Text style={styles.title}> Tap to Select Memos </Text>
    <FlatList
      data={toRender}
      renderItem={({item}) => (
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            marginBottom: 8,
            maxWidth: (Dimensions.get('window').width)/2,
            alignItems: 'center',
            
          }}>     
        {pressedTracker[item.id] === true ? <TouchableOpacity onPress={() => onPressHandler(item)} style={{opacity: 0.5}}>
            <Video
                ref={video}
                style={styles.video}
                source={{
                uri: item.videoURI,
                }}
                resizeMode="cover"
                
            />
            </TouchableOpacity>
            :
            <TouchableOpacity onPress={() => onPressHandler(item)}>
            <Video
                ref={video}
                style={styles.video}
                source={{
                uri: item.videoURI,
                }}
                resizeMode="cover"
                
            />
            </TouchableOpacity>}


        </View>
      )}
      //Setting the number of column
      numColumns={2}
      keyExtractor={(item, index) => index}
    />
    </ScrollView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ffff',
  },
  video: {
    alignSelf: 'center',
    width: (Dimensions.get('window').width)/2 - 8,
    height: 200,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    justifyContent: 'center',
    alignSelf: 'center',
    textAlign: 'center',
    padding: 30,
    fontSize: 32,
  },
});
