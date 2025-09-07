import 'react-native-gesture-handler';
import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import BottomTabNavigator from './components/BottomTabNavigator';
import SplashScreen from './components/SplashScreen';
import OnboardingScreen from './pages/OnboardingScreen';
import LoginScreen from './pages/LoginScreen';

const App = () => {
  const [currentScreen, setCurrentScreen] = useState('splash'); // 'splash', 'login', 'onboarding', 'main'

  const handleSplashFinish = () => {
    setCurrentScreen('login');
  };

  const handleLogin = () => {
    setCurrentScreen('onboarding');
  };

  const handleOnboardingComplete = () => {
    setCurrentScreen('main');
  };

  // 현재 화면에 따라 렌더링
  switch (currentScreen) {
    case 'splash':
      return <SplashScreen onFinish={handleSplashFinish} />;
      
    case 'login':
      return <LoginScreen onLogin={handleLogin} />;
      
    case 'onboarding':
      return <OnboardingScreen onComplete={handleOnboardingComplete} />;
      
    case 'main':
      return (
        <SafeAreaProvider>
          <NavigationContainer>
            <BottomTabNavigator />
          </NavigationContainer>
        </SafeAreaProvider>
      );
      
    default:
      return <SplashScreen onFinish={handleSplashFinish} />;
  }
};

export default App;