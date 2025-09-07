import React, { useState } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import TextHighlight from './test/TextHighlight';
import EmotionSelect from './test/EmotionSelect';
import Editor from './test/TodayEditor';

const App = () => {
  const [currentScreen, setCurrentScreen] = useState('Home');

  const renderScreen = () => {
    switch (currentScreen) {
      case 'TextHighlight':
        return <TextHighlight />;
      case 'EmotionSelect':
        return <EmotionSelect />;
        case 'Editor':
        return <Editor />;
      default:
        return (
          <View style={styles.homeContainer}>
            <Text style={styles.title}>메인 화면</Text>
            <TouchableOpacity 
              style={styles.button} 
              onPress={() => setCurrentScreen('TextHighlight')}
            >
              <Text style={styles.buttonText}>텍스트 하이라이트 보기</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.button} 
              onPress={() => setCurrentScreen('EmotionSelect')}
            >
              <Text style={styles.buttonText}>감정 선택 보기</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.button} 
              onPress={() => setCurrentScreen('Editor')}
            >
              <Text style={styles.buttonText}>에디터 보기</Text>
            </TouchableOpacity>
          </View>
        );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* 홈이 아닐 때 뒤로가기 버튼 표시 */}
      {currentScreen !== 'Home' && (
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => setCurrentScreen('Home')}
          >
            <Text style={styles.backButtonText}>← 뒤로가기</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {currentScreen === 'TextHighlight' ? '텍스트 하이라이트' : '감정 선택'}
          </Text>
        </View>
      )}
      
      {renderScreen()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    paddingRight: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  homeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginVertical: 10,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default App;
