import React from 'react';
import { View, StyleSheet } from 'react-native';
import GifPlayer from 'react-native-gif';

const AnimatedGif = () => {
  return (
    <View style={styles.container}>
      <GifPlayer
        gifSource={{require:'../assets/images/bwopcat.gif' }}
        style={styles.gif}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gif: {
    width: 200,
    height: 200,
  },
});

export default AnimatedGif;