// LoginScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import loginStyles from './../styles/LoginScreenStyle';
import customFont from '../styles/fonts';
import CustomAlert from '../components/CustomAlert';
import { useCustomAlert } from '../hooks/useCustomAlert';

const LoginScreen = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const { alertConfig, showAlert, hideAlert } = useCustomAlert();

  // 이메일과 비밀번호가 모두 입력되었는지 확인
  const isFormComplete = email.trim() !== '' && password.trim() !== '';

  // 컴포넌트 마운트 시 자동로그인 확인
  useEffect(() => {
    checkAutoLogin();
  }, []);

  // 자동로그인 확인
  const checkAutoLogin = async () => {
    try {
      const savedLoginData = await AsyncStorage.getItem('autoLoginData');

      if (savedLoginData) {
        const loginData = JSON.parse(savedLoginData);
        const saveTime = new Date(loginData.saveTime);
        const now = new Date();
        const daysDiff = (now - saveTime) / (1000 * 60 * 60 * 24);

        if (daysDiff >= 3) {
          console.log('3일 경과로 자동로그인 데이터 삭제');
          await AsyncStorage.removeItem('autoLoginData');
          setIsChecking(false);
          return;
        }

        console.log('자동로그인 시도:', loginData.email);
        await performAutoLogin(loginData.email, loginData.password);
      } else {
        setIsChecking(false);
      }
    } catch (error) {
      console.error('자동로그인 확인 오류:', error);
      setIsChecking(false);
    }
  };

  // 자동로그인 수행
  const performAutoLogin = async (savedEmail, savedPassword) => {
    try {
      const response = await fetch('http://comma.gamja.cloud/v1/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          email: savedEmail,
          password: savedPassword,
        }),
      });

      console.log('자동로그인 응답 상태:', response.status);

      if (response.ok) {
        const userData = await response.json();
        console.log('자동로그인 성공:', userData);

        await saveLoginData(savedEmail, savedPassword, userData);
        onLogin(userData);
      } else {
        console.log('자동로그인 실패, 저장된 정보 삭제');
        await AsyncStorage.removeItem('autoLoginData');
        setIsChecking(false);
      }
    } catch (error) {
      console.error('자동로그인 오류:', error);
      setIsChecking(false);
    }
  };

  // 로그인 정보 저장
  const saveLoginData = async (emailToSave, passwordToSave, userInfo = null) => {
    try {
      const loginData = {
        email: emailToSave,
        password: passwordToSave,
        saveTime: new Date().toISOString(),
      };

      // 사용자 정보가 있으면 추가로 저장
      if (userInfo) {
        loginData.name = userInfo.name;
        loginData.token = userInfo.token;
        loginData.expiresAt = userInfo.expiresAt;
      }

      await AsyncStorage.setItem('autoLoginData', JSON.stringify(loginData));
      console.log('로그인 정보 저장 완료');
    } catch (error) {
      console.error('로그인 정보 저장 오류:', error);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      showAlert({
        title: '알림',
        message: '모든 정보를 입력해주세요.',
        type: 'warning',
        buttons: [{ text: '확인', onPress: hideAlert }]
      });
      return;
    }

    // 간단한 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showAlert({
        title: '알림',
        message: '올바른 이메일 형식을 입력해주세요.',
        type: 'warning',
        buttons: [{ text: '확인', onPress: hideAlert }]
      });
      return;
    }

    setIsLoading(true);

    try {
      console.log('로그인 시도:', { email, password });

      const response = await fetch('http://comma.gamja.cloud/v1/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password.trim(),
        }),
      });

      console.log('응답 상태:', response.status);

      if (response.ok) {
        const userData = await response.json();
        console.log('로그인 성공:', userData);

        await saveLoginData(email.trim(), password.trim(), userData);

        showAlert({
          title: '성공',
          message: '로그인되었습니다!',
          type: 'success',
          buttons: [{
            text: '확인',
            onPress: () => {
              hideAlert();
              onLogin(userData);
            }
          }]
        });
      } else {
        const errorText = await response.text();
        console.log('에러 응답:', errorText);
        showAlert({
          title: '로그인 실패',
          message: '이메일 또는 비밀번호를 확인해주세요.',
          type: 'error',
          buttons: [{ text: '확인', onPress: hideAlert }]
        });
      }
    } catch (error) {
      console.error('로그인 에러:', error);
      showAlert({
        title: '오류',
        message: '네트워크 연결을 확인해주세요.',
        type: 'error',
        buttons: [{ text: '확인', onPress: hideAlert }]
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 자동로그인 확인 중일 때 로딩 화면
  if (isChecking) {
    return (
      <View style={[loginStyles['login-container'], { justifyContent: 'center', alignItems: 'center' }]}>
        <View style={loginStyles['login-logo-container']}>
          <Image
            source={require('../assets/logo1.png')}
            style={[loginStyles['login-logo-image'], { marginBottom: 20 }]}
            resizeMode="contain"
          />
        </View>
        <ActivityIndicator size="large" color="#FF6B6B" />
        <Text style={{ marginTop: 16, fontSize: 22, color: '#666', fontFamily: customFont }}>자동로그인 중...</Text>
      </View>
    );
  }

  return (
    <>
      <KeyboardAvoidingView
        style={loginStyles['login-container']}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={loginStyles['login-scroll-container']}>
          {/* 로고 및 인사말 영역 */}
          <View style={loginStyles['login-header-section']}>
            <View style={loginStyles['login-logo-container']}>
              <Image
                source={require('../assets/logo1.png')}
                style={loginStyles['login-logo-image']}
                resizeMode="contain"
              />
            </View>

            <Text style={loginStyles['login-greeting-text']}>How are you feeling today?</Text>
          </View>

          {/* 입력 폼 */}
          <View style={loginStyles['login-form-container']}>
            <TextInput
              style={loginStyles['login-input']}
              placeholder="Email"
              placeholderTextColor="#A8A8A8"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isLoading}
            />

            <TextInput
              style={loginStyles['login-input']}
              placeholder="Password"
              placeholderTextColor="#A8A8A8"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={true}
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isLoading}
            />

            {/* 시작하기 버튼 */}
            <TouchableOpacity
              style={[
                isFormComplete ?
                  loginStyles['login-signup-button-active'] :
                  loginStyles['login-signup-button'],
                isLoading && { opacity: 0.6 }
              ]}
              onPress={handleLogin}
              activeOpacity={0.8}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={isFormComplete ?
                  loginStyles['login-signup-button-text-active'] :
                  loginStyles['login-signup-button-text']
                }>
                  시작하기
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* 커스텀 Alert 추가 */}
      <CustomAlert
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        buttons={alertConfig.buttons}
        type={alertConfig.type}
        onBackdropPress={hideAlert}
      />
    </>
  );
};

export default LoginScreen;
