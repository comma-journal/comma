// App.tsx
import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomTabNavigator from './components/BottomTabNavigator';
import SplashScreen from './components/SplashScreen';
import OnboardingScreen from './pages/OnboardingScreen';
import LoginScreen from './pages/LoginScreen';
import DiaryDetail from './pages/DiaryDetail';
import Write from './pages/Write';
import DiaryEditor from './pages/DiaryEditor';
import EmotionSelector from './pages/EmotionSelector';


const Stack = createStackNavigator();

const App = () => {
  const [currentScreen, setCurrentScreen] = useState('splash');
  const [userEmail, setUserEmail] = useState(null);

  // 개발/테스트용 - 온보딩 상태 초기화 함수
  const resetOnboarding = async () => {
    try {
      await AsyncStorage.removeItem('onboardingCompleted');
      console.log('온보딩 상태 초기화됨');
    } catch (error) {
      console.error('온보딩 상태 초기화 실패:', error);
    }
  };

  // 온보딩 완료 상태 확인 함수
  const checkOnboardingStatus = async () => {
    try {
      const onboardingCompleted = await AsyncStorage.getItem('onboardingCompleted');
      return onboardingCompleted === 'true';
    } catch (error) {
      console.error('온보딩 상태 확인 실패:', error);
      return false;
    }
  };

  const handleSplashFinish = async () => {
    // 개발 시 온보딩 상태 초기화 (필요할 때만 주석 해제)
    // await resetOnboarding();
    
    // 스플래시 화면이 끝나면 온보딩 상태 확인
    const isOnboardingCompleted = await checkOnboardingStatus();
    
    if (isOnboardingCompleted) {
      setCurrentScreen('login');
    } else {
      setCurrentScreen('login');
    }
  };

  const handleLogin = async (email: any) => {
    setUserEmail(email);
    
    // 로그인 후 온보딩 상태 다시 확인
    const isOnboardingCompleted = await checkOnboardingStatus();
    
    if (isOnboardingCompleted) {
      setCurrentScreen('main');
    } else {
      setCurrentScreen('onboarding');
    }
  };

  const handleOnboardingComplete = () => {
    setCurrentScreen('main');
  };

  // 메인 앱 네비게이션 (Stack Navigator 포함)
  const MainAppNavigator = () => {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
        <Stack.Screen name="DiaryDetail" component={DiaryDetail} />
        <Stack.Screen name="WriteList" component={Write} />
        <Stack.Screen name="DiaryEditor" component={DiaryEditor} />
        <Stack.Screen name="EmotionSelector" component={EmotionSelector} />
      </Stack.Navigator>
    );
  };

  // 현재 화면에 따라 렌더링
  switch (currentScreen) {
    case 'splash':
      return <SplashScreen onFinish={handleSplashFinish} />;
      
    case 'login':
      return <LoginScreen onLogin={handleLogin} />;
      
    case 'onboarding':
      return (
        <OnboardingScreen 
          onComplete={handleOnboardingComplete}
          userEmail={userEmail}
        />
      );
      
    case 'main':
      return (
        <SafeAreaProvider>
          <NavigationContainer>
            <MainAppNavigator />
          </NavigationContainer>
        </SafeAreaProvider>
      );
      
    default:
      return <SplashScreen onFinish={handleSplashFinish} />;
  }
};

export default App;