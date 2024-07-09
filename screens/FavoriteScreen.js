import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const FavoriteScreen = () => {
  return (
    <View>
      <Text>FavoriteScreen</Text>
    </View>
  )
}

export default FavoriteScreen

const styles = StyleSheet.create({})
/*import { StyleSheet, Text, View } from 'react-native'
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import All from './All';
import Business from './Business';
import Health from './Health';

const Drawer = createDrawerNavigator();

const FavoriteScreen = () => {
  return (
    <Drawer.Navigator initialRouteName="Home">
       <Drawer.Screen name="Home" component={All} />
       <Drawer.Screen name="Business" component={Business} />
       <Drawer.Screen name="Health" component={Health}/>
      </Drawer.Navigator>
  )
}

export default FavoriteScreen

const styles = StyleSheet.create({}) */