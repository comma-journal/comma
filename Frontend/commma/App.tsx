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
      await AsyncStorage.removeItem('completedUsers'); // 완료된 유저 목록도 초기화
      console.log('🔄 온보딩 상태 및 유저 목록 초기화됨');
    } catch (error) {
      console.error('❌ 온보딩 상태 초기화 실패:', error);
    }
  };

  // 특정 유저의 온보딩 완료 상태 확인 함수
  const checkUserOnboardingStatus = async (email:any) => {
    try {
      // 방법 1: 유저별 온보딩 상태 저장
      const userOnboardingKey = `onboarding_${email}`;
      const userOnboardingCompleted = await AsyncStorage.getItem(userOnboardingKey);
      
      console.log('🔍 유저별 온보딩 상태 확인:');
      console.log('   - 이메일:', email);
      console.log('   - 저장 키:', userOnboardingKey);
      console.log('   - 저장된 값:', userOnboardingCompleted);
      console.log('   - 완료 여부:', userOnboardingCompleted === 'true');
      
      return userOnboardingCompleted === 'true';
    } catch (error) {
      console.error('❌ 유저 온보딩 상태 확인 실패:', error);
      return false;
    }
  };

  // 전체 온보딩 완료 상태 확인 함수 (기존 방식 - 디버깅용)
  const checkOnboardingStatus = async () => {
    try {
      const onboardingCompleted = await AsyncStorage.getItem('onboardingCompleted');
      console.log('🔍 전체 온보딩 상태 확인:');
      console.log('   - 저장된 값:', onboardingCompleted);
      console.log('   - 타입:', typeof onboardingCompleted);
      console.log('   - 완료 여부:', onboardingCompleted === 'true');
      
      return onboardingCompleted === 'true';
    } catch (error) {
      console.error('❌ 온보딩 상태 확인 실패:', error);
      return false;
    }
  };

  // AsyncStorage 전체 상태 확인 함수 (디버깅용)
  const debugAsyncStorage = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      console.log('🗄️ AsyncStorage 전체 키 목록:', keys);
      
      for (const key of keys) {
        const value = await AsyncStorage.getItem(key);
        console.log(`   - ${key}: ${value}`);
      }
    } catch (error) {
      console.error('❌ AsyncStorage 디버깅 실패:', error);
    }
  };

  const handleSplashFinish = async () => {
    console.log('🚀 스플래시 화면 종료');
    
    // 개발 시 온보딩 상태 초기화 (필요할 때만 주석 해제)
    // await resetOnboarding();
    
    // 디버깅용: AsyncStorage 전체 상태 확인
    await debugAsyncStorage();
    
    // 스플래시 화면이 끝나면 항상 로그인 화면으로
    console.log('➡️ 로그인 화면으로 이동');
    setCurrentScreen('login');
  };

  const handleLogin = async (email:any) => {
    console.log('👤 로그인 처리 시작');
    console.log('   - 이메일:', email);
    
    setUserEmail(email);
    
    // 해당 유저의 온보딩 상태 확인
    console.log('🔍 해당 유저의 온보딩 상태 확인 중...');
    const isUserOnboardingCompleted = await checkUserOnboardingStatus(email);
    
    console.log('📊 해당 유저의 온보딩 완료 여부:', isUserOnboardingCompleted);
    
    if (isUserOnboardingCompleted) {
      // 해당 유저가 온보딩을 완료한 경우 바로 메인으로
      console.log('✅ 해당 유저 온보딩 완료됨 - 메인 앱으로 이동');
      setCurrentScreen('main');
    } else {
      // 해당 유저가 온보딩을 완료하지 않은 경우 온보딩으로
      console.log('📝 해당 유저 온보딩 미완료 - 온보딩 페이지로 이동');
      setCurrentScreen('onboarding');
    }
  };

  const handleOnboardingComplete = async () => {
    console.log('🎉 온보딩 완료 처리 시작');
    console.log('   - 대상 유저:', userEmail);
    
    try {
      if (userEmail) {
        // 유저별 온보딩 완료 상태 저장
        const userOnboardingKey = `onboarding_${userEmail}`;
        await AsyncStorage.setItem(userOnboardingKey, 'true');
        console.log('✅ 유저별 온보딩 완료 상태 저장됨:', userOnboardingKey);
        
        // 저장 후 확인
        const savedValue = await AsyncStorage.getItem(userOnboardingKey);
        console.log('🔍 저장 후 확인된 값:', savedValue);
      } else {
        console.warn('⚠️ 유저 이메일이 없어서 유저별 온보딩 상태를 저장할 수 없습니다');
      }
      
      // 전체 온보딩 완료 상태도 저장 (기존 로직 유지)
      await AsyncStorage.setItem('onboardingCompleted', 'true');
      console.log('✅ 전체 온보딩 완료 상태도 저장됨');
      
    } catch (error) {
      console.error('❌ 온보딩 완료 상태 저장 실패:', error);
    }
    
    console.log('➡️ 메인 앱으로 이동');
    setCurrentScreen('main');
  };

  // 로그아웃 핸들러
  const handleLogout = async () => {
    console.log('🚪 로그아웃 처리 시작');
    
    try {
      // AsyncStorage에서 로그인 정보 제거
      await AsyncStorage.removeItem('autoLoginData');
      console.log('✅ 로그인 정보 삭제 완료');
      
      // 온보딩 상태는 유지 (유저별로 관리되므로)
      // 필요시 특정 유저의 온보딩 상태만 초기화
      // const userOnboardingKey = `onboarding_${userEmail}`;
      // await AsyncStorage.removeItem(userOnboardingKey);
      
    } catch (error) {
      console.error('❌ 로그아웃 처리 실패:', error);
    }
    
    console.log('➡️ 로그인 화면으로 이동');
    setCurrentScreen('login');
    setUserEmail(null);
  };

  // 화면 변경 시 디버깅 로그
  useEffect(() => {
    console.log('🖥️ 현재 화면 상태 변경:', currentScreen);
  }, [currentScreen]);

  // 메인 앱 네비게이션 (Stack Navigator 포함)
  const MainAppNavigator = () => {
    console.log('🏠 메인 앱 네비게이터 렌더링');
    
    return (
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen 
              name="MainTabs" 
              children={() => <BottomTabNavigator onLogout={handleLogout} />}
            />
            <Stack.Screen name="DiaryDetail" component={DiaryDetail} />
            <Stack.Screen name="WriteList" component={Write} />
            <Stack.Screen name="DiaryEditor" component={DiaryEditor} />
            <Stack.Screen name="EmotionSelector" component={EmotionSelector} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
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
      return <MainAppNavigator />;
      
    default:
      return <SplashScreen onFinish={handleSplashFinish} />;
  }
};

export default App;