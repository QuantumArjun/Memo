
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Button, ImageComponent, IconButton, FlatList, Dimensions, SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import AlbumScreen from '../screens/albumScreen';
import Post from "../components/posts";
import posts from "../data/samplePosts";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Items} from '../components/storage';
import { useEffect } from 'react';
import { useState } from 'react/cjs/react.development';

export default function HomeScreen({ navigation }) {
  const [isLoading, setisLoading] = useState(false);

  var toRender = [];

  //Here, we are loading in the preset posts (initially set in App.js)
    const loadData =  async () => {
      var keys; 
      var uri;

      try {
        keys = await AsyncStorage.getAllKeys()
      } catch{}
        

      //Loops through all keys and retrieves the attaches URIs
      for (var i = 0; i < keys.length; i++) {
        let post = keys[i];
        

        try {
          uri = await AsyncStorage.getItem(post);
          
          
        } catch{}

        if (uri != null){
            tempObj = {
            'id': post,
            "videoURI": uri,
          }
          //Dynamically creates a "toRender" object and stores it in state
          toRender.push(tempObj)
        }
        
      }

      //Once finished, updates the page to "hopefuly" force the page to reloud
      setisLoading(true);
    }

    //Runs our toLoad functiomn
    loadData();
    
  
  
  const Item = ({ title }) => (
      <Post uri={title}>{title}</Post>
  );

  const renderItem = ({ item }) => (
    <Item title={item.videoURI} />
  );

  if (toRender.length === 0) {
    return (
      <Text>
      No posts yet!
      </Text>
    )

  } else {
    return (
      <SafeAreaView style={styles.container}>
        <FlatList
          data={toRender}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          snapToInterval = {Dimensions.get('window').height - 180}
          snapToAlignment={'start'}
          decelerationRate={'fast'}
        />
      </SafeAreaView>
    );

    }
    
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
});