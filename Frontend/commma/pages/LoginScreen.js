import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import loginStyles from './../styles/LoginScreenStyle';

const LoginScreen = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 이메일과 비밀번호가 모두 입력되었는지 확인
  const isFormComplete = email.trim() !== '' && password.trim() !== '';

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('알림', '모든 정보를 입력해주세요.');
      return;
    }

    // 간단한 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('알림', '올바른 이메일 형식을 입력해주세요.');
      return;
    }

    try {
      console.log('로그인 시도:', { email, password });
      
      // API 호출
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
        
        Alert.alert('성공', '로그인되었습니다!', [
          { text: '확인', onPress: () => onLogin() }
        ]);
      } else {
        const errorText = await response.text();
        console.log('에러 응답:', errorText);
        Alert.alert('로그인 실패', '이메일 또는 비밀번호를 확인해주세요.');
      }
    } catch (error) {
      console.error('로그인 에러:', error);
      
    }
  };

  return (
    <KeyboardAvoidingView 
      style={loginStyles['login-container']}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={loginStyles['login-scroll-container']}>
        {/* 로고 및 인사말 영역 */}
        <View style={loginStyles['login-header-section']}>
          {/* 로고 이미지 */}
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
          />

          {/* 시작하기 버튼 */}
          <TouchableOpacity 
            style={isFormComplete ? 
              loginStyles['login-signup-button-active'] : 
              loginStyles['login-signup-button']
            } 
            onPress={handleLogin}
            activeOpacity={0.8}
          >
            <Text style={isFormComplete ? 
              loginStyles['login-signup-button-text-active'] : 
              loginStyles['login-signup-button-text']
            }>
              시작하기
            </Text>
          </TouchableOpacity>

          {/* 로그인 문구 */}
          {/* <Text style={loginStyles['login-help-text']}>로그인에 문제가 생겼나요?</Text> */}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;