import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Write = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>일기쓰기</Text>
      <Text>오늘의 일기를 작성해보세요</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default Write;