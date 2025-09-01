import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, Image } from 'react-native';

const { width, height } = Dimensions.get('window');

const SplashScreen = ({ onFinish }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const textFadeAnim = useRef(new Animated.Value(0)).current;
  const subtitleFadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 순차적인 서정적 애니메이션
    Animated.sequence([
      // 로고 부드럽게 등장
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 20,
          friction: 10,
          useNativeDriver: true,
        }),
      ]),
      // 앱 이름 등장
      Animated.timing(textFadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      // 서브타이틀 등장
      Animated.timing(subtitleFadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();

    // 스플래시 종료
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }).start(() => {
        onFinish();
      });
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnim,
          }
        ]}
      >
        {/* 부드러운 배경 원 */}
        <View style={styles.backgroundCircle} />
        
        <Animated.View 
          style={[
            styles.logoContainer,
            { 
              transform: [{ scale: scaleAnim }],
              opacity: fadeAnim,
            }
          ]}
        >
          <Image
            source={require('../assets/logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </Animated.View>
        
        <Animated.Text 
          style={[
            styles.appName,
            { opacity: textFadeAnim }
          ]}
        >
          쉼표
        </Animated.Text>
        
        <Animated.Text 
          style={[
            styles.subtitle,
            { opacity: subtitleFadeAnim }
          ]}
        >
          잠깐 멈춰서, 생각을 기록해보세요
        </Animated.Text>
        
        <Animated.Text 
          style={[
            styles.poeticText,
            { opacity: subtitleFadeAnim }
          ]}
        >
          "글쓰기는 마음을 들여다보는 거울"
        </Animated.Text>
        
        {/* 부드러운 점들 */}
        <Animated.View 
          style={[
            styles.dotsContainer,
            { opacity: subtitleFadeAnim }
          ]}
        >
          <View style={[styles.dot, { backgroundColor: '#FFB5BA' }]} />
          <View style={[styles.dot, { backgroundColor: '#B5D8FF' }]} />
          <View style={[styles.dot, { backgroundColor: '#C8E6C9' }]} />
        </Animated.View>
      </Animated.View>
      
      <Animated.View 
        style={[
          styles.footer,
          { opacity: subtitleFadeAnim }
        ]}
      >
        <Text style={styles.version}>v1.0.0</Text>
        <Text style={styles.copyright}>© 2025 쉼표</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  backgroundCircle: {
    position: 'absolute',
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.4,
    backgroundColor: 'rgba(112, 161, 255, 0.05)',
    top: '15%',
  },
  logoContainer: {
    marginBottom: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 50,
    padding: 30,
    shadowColor: '#70A1FF',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 12,
  },
  logoImage: {
    width: 80,
    height: 80,
  },
  appName: {
    fontSize: 42,
    fontWeight: '300',
    color: '#2C3E50',
    marginBottom: 15,
    textAlign: 'center',
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 16,
    color: '#7F8C8D',
    textAlign: 'center',
    fontWeight: '400',
    marginBottom: 25,
    lineHeight: 24,
  },
  poeticText: {
    fontSize: 14,
    color: '#95A5A6',
    textAlign: 'center',
    fontStyle: 'italic',
    fontWeight: '300',
    marginBottom: 40,
    marginHorizontal: 40,
    lineHeight: 20,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 8,
    opacity: 0.7,
  },
  footer: {
    position: 'absolute',
    bottom: 60,
    alignItems: 'center',
  },
  version: {
    color: '#BDC3C7',
    fontSize: 12,
    marginBottom: 5,
    fontWeight: '300',
  },
  copyright: {
    color: '#BDC3C7',
    fontSize: 11,
    fontWeight: '300',
  },
});

export default SplashScreen;