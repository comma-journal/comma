import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, Dimensions, Image } from 'react-native';
import splashStyles from '../styles/components/SplashScreenStyle';

const { width, height } = Dimensions.get('window');

const SplashScreen = ({ onFinish }) => {
  const logoFadeAnim = useRef(new Animated.Value(0)).current;
  const logoScaleAnim = useRef(new Animated.Value(0.9)).current;
  const textFadeAnim = useRef(new Animated.Value(0)).current;
  const containerFadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // 순차적 애니메이션
    Animated.sequence([
      // 1. 로고 먼저 등장
      Animated.parallel([
        Animated.timing(logoFadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(logoScaleAnim, {
          toValue: 1,
          tension: 30,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
      // 2. 잠시 대기
      Animated.delay(300),
      // 3. 텍스트 페이드인
      Animated.timing(textFadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // 스플래시 종료
    const timer = setTimeout(() => {
      Animated.timing(containerFadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        onFinish();
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={splashStyles['splash-container']}>
      <Animated.View 
        style={[
          splashStyles['splash-content'],
          {
            opacity: containerFadeAnim,
          }
        ]}
      >
        {/* 로고 이미지 */}
        <Animated.View 
          style={[
            splashStyles['splash-logo-container'],
            {
              opacity: logoFadeAnim,
              transform: [{ scale: logoScaleAnim }],
            }
          ]}
        >
          <Image
            source={require('../assets/logo1.png')}
            style={splashStyles['splash-logo-image']}
            resizeMode="contain"
          />
        </Animated.View>
        
        {/* 앱 이름 */}
        <Animated.Text 
          style={[
            splashStyles['splash-app-name'],
            {
              opacity: textFadeAnim,
            }
          ]}
        >
          쉼표
        </Animated.Text>
      </Animated.View>
    </View>
  );
};

export default SplashScreen;