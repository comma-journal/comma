import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
  Image,
  TextInput,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import customFont from '../styles/fonts';
import CustomAlert from '../components/CustomAlert';
import { useCustomAlert } from '../hooks/useCustomAlert';

const { width, height } = Dimensions.get('window');

const OnboardingScreen = ({ onComplete, userEmail }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [userName, setUserName] = useState('');
  const { alertConfig, showAlert, hideAlert } = useCustomAlert();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const highlightAnim = useRef(new Animated.Value(0)).current;
  const questionFloatAnim = useRef(new Animated.Value(0)).current;
  const calendarSlideAnim = useRef(new Animated.Value(0)).current;
  const emojiFloatAnim = useRef(new Animated.Value(0)).current;
  const nameInputAnim = useRef(new Animated.Value(0)).current;
  const welcomeTextAnim = useRef(new Animated.Value(0)).current;

  const onboardingSteps = [
    {
      id: 1,
      title: "어떻게 불러드릴까요?",
      subtitle: "쉼표에서 사용할 이름을 알려주세요",
      animation: 'name'
    },
    {
      id: 2,
      title: `${userName || '당신'}을 위한\n특별한 공간`,
      subtitle: "쉼표는 당신의 마음을 담는 디지털 일기장입니다",
      animation: 'welcome'
    },
    {
      id: 3,
      title: "AI가 감정을 찾아\n하이라이트해줘요",
      subtitle: `${userName || '당신'}의 일기에서 감정이 담긴 부분을\n자동으로 색칠하고 질문을 제안합니다`,
      animation: 'highlight'
    },
    {
      id: 4,
      title: "완성된 일기는\n감정 캘린더로",
      subtitle: `${userName || '당신'}의 감정이 색깔로 구분된 이모지가\n캘린더에 표시됩니다`,
      animation: 'calendar'
    },
    {
      id: 5,
      title: `${userName}님,\n쉼표와 함께하세요`,
      subtitle: "감정을 기록하고 마음을 돌보는 여정을 시작해요",
      animation: 'final'
    }
  ];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  // 온보딩 완료 상태 저장 함수
  const saveOnboardingComplete = async () => {
    try {
      await AsyncStorage.setItem('onboardingCompleted', 'true');
      console.log('온보딩 완료 상태 저장됨');
    } catch (error) {
      console.error('온보딩 완료 상태 저장 실패:', error);
    }
  };

  useEffect(() => {
    if (currentStep === 0) {
      // 이름 입력 애니메이션
      nameInputAnim.setValue(0);
      
      setTimeout(() => {
        Animated.spring(nameInputAnim, {
          toValue: 1,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }).start();
      }, 200);
    } else if (currentStep === 2) {
      // 하이라이트 애니메이션
      highlightAnim.setValue(0);
      questionFloatAnim.setValue(0);
      
      setTimeout(() => {
        Animated.sequence([
          Animated.timing(highlightAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: false,
          }),
          Animated.timing(questionFloatAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          })
        ]).start();
      }, 500);
    } else if (currentStep === 3) {
      // 캘린더 애니메이션
      calendarSlideAnim.setValue(0);
      emojiFloatAnim.setValue(0);
      
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(calendarSlideAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(emojiFloatAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          })
        ]).start();
      }, 300);
    } else if (currentStep === 4) {
      // 최종 환영 애니메이션
      welcomeTextAnim.setValue(0);
      
      setTimeout(() => {
        Animated.sequence([
          Animated.timing(welcomeTextAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.delay(1500),
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 800,
            useNativeDriver: true,
          })
        ]).start(async () => {
          // 온보딩 완료 상태 저장 후 onComplete 호출
          await saveOnboardingComplete();
          onComplete();
        });
      }, 500);
    }
  }, [currentStep]);

  const nextStep = async () => {
    if (currentStep === 0) {
      // 첫 번째 단계에서 이름 설정 API 호출
      if (!userName.trim()) {
        showAlert({
          title: '알림',
          message: '이름을 입력해주세요.',
          type: 'warning',
          buttons: [{ text: '확인', onPress: hideAlert }]
        });
        return;
      }
      
      await handleNameSetting();
    }

    if (currentStep < onboardingSteps.length - 1) {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 200,
          useNativeDriver: true,
        })
      ]).start(() => {
        setCurrentStep(currentStep + 1);
        
        // 애니메이션 값들 리셋
        highlightAnim.setValue(0);
        questionFloatAnim.setValue(0);
        calendarSlideAnim.setValue(0);
        emojiFloatAnim.setValue(0);
        nameInputAnim.setValue(0);
        welcomeTextAnim.setValue(0);
        
        // 새 페이지 등장 애니메이션
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.spring(scaleAnim, {
            toValue: 1,
            tension: 50,
            friction: 8,
            useNativeDriver: true,
          })
        ]).start();
      });
    }
  };

  const handleNameSetting = async () => {
    try {
      console.log('🔍 [OnboardingScreen] 이름 설정 시작:', userName.trim());
      
      // AsyncStorage에서 토큰 가져오기
      const savedLoginData = await AsyncStorage.getItem('autoLoginData');
      if (!savedLoginData) {
        console.error('❌ [OnboardingScreen] 로그인 데이터를 찾을 수 없음');
        showAlert({
          title: '오류',
          message: '로그인 정보를 찾을 수 없습니다.',
          type: 'error',
          buttons: [{ text: '확인', onPress: hideAlert }]
        });
        return;
      }

      const loginData = JSON.parse(savedLoginData);
      const token = loginData.token;
      
      if (!token) {
        console.error('❌ [OnboardingScreen] 토큰을 찾을 수 없음');
        showAlert({
          title: '오류',
          message: '인증 정보가 없습니다.',
          type: 'error',
          buttons: [{ text: '확인', onPress: hideAlert }]
        });
        return;
      }

      console.log('📤 [OnboardingScreen] API 호출 시작');
      console.log('  - 토큰:', token ? '있음' : '없음');
      console.log('  - 이름:', userName.trim());

      const response = await fetch(`https://comma.gamja.cloud/v1/users?name=${encodeURIComponent(userName.trim())}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      console.log('📥 [OnboardingScreen] API 응답 상태:', response.status);

      if (response.ok) {
        console.log('✅ [OnboardingScreen] 이름 설정 성공:', userName);
        
        // AsyncStorage의 사용자 정보 업데이트
        const updatedLoginData = {
          ...loginData,
          name: userName.trim()
        };
        await AsyncStorage.setItem('autoLoginData', JSON.stringify(updatedLoginData));
        console.log('✅ [OnboardingScreen] 로컬 스토리지 업데이트 완료');
        
      } else {
        const errorText = await response.text();
        console.error('❌ [OnboardingScreen] 이름 설정 실패:', response.status, errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
    } catch (error) {
      console.error('❌ [OnboardingScreen] 네트워크 오류:', error);
      showAlert({
        title: '오류',
        message: '이름 설정에 실패했습니다. 계속 진행하시겠습니까?',
        type: 'warning',
        buttons: [
          { text: '다시 시도', style: 'cancel', onPress: hideAlert },
          { text: '계속 진행', onPress: hideAlert }
        ]
      });
    }
  };

  const renderNameSettingAnimation = () => (
    <Animated.View 
      style={[
        styles.animationContainer,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }]
        }
      ]}
    >
      <View style={styles.nameSettingContainer}>
        <Animated.View 
          style={[
            styles.nameIconContainer,
            {
              transform: [{
                scale: nameInputAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 1]
                })
              }],
              opacity: nameInputAnim
            }
          ]}
        >
          <Image
            source={require('../assets/logo1.png')}
            style={styles.nameLogoImage}
            resizeMode="contain"
          />
        </Animated.View>
        
        <Animated.View 
          style={[
            styles.nameInputSection,
            {
              transform: [{
                translateY: nameInputAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [30, 0]
                })
              }],
              opacity: nameInputAnim
            }
          ]}
        >
          <View style={styles.inputCard}>
            <TextInput
              style={styles.nameTextInput}
              placeholder="예) 김쉼표"
              placeholderTextColor="#B0B0B0"
              value={userName}
              onChangeText={setUserName}
              autoCapitalize="words"
              autoCorrect={false}
              maxLength={10}
              autoFocus={currentStep === 0}
            />
          </View>
          
          <View style={styles.nameFeatures}>
            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Text style={styles.featureIconText}>🔒</Text>
              </View>
              <Text style={styles.featureText}>언제든지 변경 가능해요</Text>
            </View>
            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Text style={styles.featureIconText}>✨</Text>
              </View>
              <Text style={styles.featureText}>개인정보는 안전하게 보호됩니다</Text>
            </View>
          </View>
        </Animated.View>
      </View>
    </Animated.View>
  );

  const renderWelcomeAnimation = () => (
    <Animated.View style={[styles.animationContainer, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/logo1.png')}
          style={styles.logoImage}
          resizeMode="contain"
        />
      </View>
      <View style={styles.welcomeDecoration}>
        <Animated.View 
          style={[
            styles.floatingDot, 
            { 
              top: 60, 
              left: 40,
              backgroundColor: '#FFE066',
              opacity: fadeAnim,
              transform: [{
                translateY: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0]
                })
              }]
            }
          ]}
        />
        <Animated.View 
          style={[
            styles.floatingDot, 
            { 
              top: 90, 
              right: 50,
              backgroundColor: '#A8E6CF',
              opacity: fadeAnim,
              transform: [{
                translateY: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [30, 0]
                })
              }]
            }
          ]}
        />
        <Animated.View 
          style={[
            styles.floatingDot, 
            { 
              bottom: 80, 
              left: 60,
              backgroundColor: '#FFB5BA',
              opacity: fadeAnim,
              transform: [{
                translateY: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [25, 0]
                })
              }]
            }
          ]}
        />
      </View>
      {userName && (
        <View style={styles.personalizedText}>
          <Text style={styles.userNameText}>{userName}님 환영해요!</Text>
        </View>
      )}
    </Animated.View>
  );

  const renderHighlightAnimation = () => (
    <View style={styles.animationContainer}>
      <View style={styles.mockupContainer}>
        <View style={styles.mockupHeader}>
          <Text style={styles.mockupTitle}>{userName}님의 일기</Text>
        </View>
        <View style={styles.diaryContent}>
          <Text style={styles.diaryText}>오늘은 정말 </Text>
          <Animated.Text 
            style={[
              styles.diaryText, 
              styles.highlightedText,
              {
                backgroundColor: highlightAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['transparent', '#FFE066']
                })
              }
            ]}
          >
            행복한
          </Animated.Text>
          <Text style={styles.diaryText}> 하루였다.</Text>
          
          <Text style={[styles.diaryText, { marginTop: 12 }]}>친구와 함께 </Text>
          <Animated.Text 
            style={[
              styles.diaryText, 
              styles.highlightedText,
              {
                backgroundColor: highlightAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['transparent', '#A8E6CF']
                })
              }
            ]}
          >
            즐거운 시간
          </Animated.Text>
          <Text style={styles.diaryText}>을 보냈다.</Text>
        </View>
        
        <Animated.View 
          style={[
            styles.aiSuggestion,
            {
              opacity: questionFloatAnim,
              transform: [{
                translateY: questionFloatAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0]
                })
              }]
            }
          ]}
        >
          <Text style={styles.suggestionLabel}>AI 제안</Text>
          <Text style={styles.suggestionText}>{userName}님, 어떤 순간이 가장 행복했나요?</Text>
        </Animated.View>
      </View>
    </View>
  );

  const renderCalendarAnimation = () => (
    <Animated.View 
      style={[
        styles.animationContainer,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }]
        }
      ]}
    >
      <View style={styles.calendarMockup}>
        <View style={styles.calendarHeader}>
          <Text style={styles.calendarTitle}>{userName}님의 9월</Text>
        </View>
        
        <Animated.View 
          style={[
            {
              opacity: calendarSlideAnim,
              transform: [{
                translateY: calendarSlideAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0]
                })
              }]
            }
          ]}
        >
          <View style={styles.weekRow}>
            {['일', '월', '화', '수', '목', '금', '토'].map((day, index) => (
              <Text 
                key={index} 
                style={[
                  styles.weekDay,
                  index === 0 && { color: '#FF6B6B' },
                  index === 6 && { color: '#4DABF7' }
                ]}
              >
                {day}
              </Text>
            ))}
          </View>
          
          <View style={styles.calendarBody}>
            <View style={styles.dateRow}>
              <View style={styles.dateItem}>
                <Text style={styles.dateNum}>1</Text>
              </View>
              <View style={styles.dateItem}>
                <Text style={styles.dateNum}>2</Text>
                <Animated.Text 
                  style={[
                    styles.emojiIcon,
                    { opacity: emojiFloatAnim }
                  ]}
                >
                  😊
                </Animated.Text>
              </View>
              <View style={styles.dateItem}>
                <Text style={styles.dateNum}>3</Text>
              </View>
              <View style={styles.dateItem}>
                <Text style={styles.dateNum}>4</Text>
              </View>
              <View style={styles.dateItem}>
                <Text style={styles.dateNum}>5</Text>
              </View>
              <View style={[styles.dateItem, styles.todayItem]}>
                <Text style={[styles.dateNum, styles.todayNum]}>6</Text>
              </View>
              <View style={styles.dateItem}>
                <Text style={styles.dateNum}>7</Text>
              </View>
            </View>
            
            <View style={styles.dateRow}>
              <View style={styles.dateItem}>
                <Text style={styles.dateNum}>8</Text>
              </View>
              <View style={styles.dateItem}>
                <Text style={styles.dateNum}>9</Text>
              </View>
              <View style={styles.dateItem}>
                <Text style={styles.dateNum}>10</Text>
              </View>
              <View style={styles.dateItem}>
                <Text style={styles.dateNum}>11</Text>
                <Animated.Text 
                  style={[
                    styles.emojiIcon,
                    { opacity: emojiFloatAnim }
                  ]}
                >
                  😌
                </Animated.Text>
              </View>
              <View style={styles.dateItem}>
                <Text style={styles.dateNum}>12</Text>
              </View>
              <View style={styles.dateItem}>
                <Text style={styles.dateNum}>13</Text>
              </View>
              <View style={styles.dateItem}>
                <Text style={styles.dateNum}>14</Text>
              </View>
            </View>
          </View>
        </Animated.View>
      </View>
    </Animated.View>
  );

  const renderFinalAnimation = () => (
    <Animated.View 
      style={[
        styles.animationContainer,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }]
        }
      ]}
    >
      <View style={styles.finalContainer}>
        <Animated.View 
          style={[
            styles.finalLogoContainer,
            {
              opacity: welcomeTextAnim,
              transform: [{
                scale: welcomeTextAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 1]
                })
              }]
            }
          ]}
        >
          <Image
            source={require('../assets/logo1.png')}
            style={styles.finalLogoImage}
            resizeMode="contain"
          />
          <Text style={styles.appName}>쉼표</Text>
        </Animated.View>
        
        <Animated.View 
          style={[
            styles.finalTextContainer,
            {
              opacity: welcomeTextAnim,
              transform: [{
                translateY: welcomeTextAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [30, 0]
                })
              }]
            }
          ]}
        >
          <Text style={styles.finalWelcomeText}>{userName}님과 함께하게 되어 기뻐요</Text>
          <Text style={styles.finalSubText}>감정을 기록하며 마음을 돌보는 여정을 시작해요</Text>
        </Animated.View>
      </View>
    </Animated.View>
  );

  const renderAnimation = () => {
    switch (currentStep) {
      case 0: return renderNameSettingAnimation();
      case 1: return renderWelcomeAnimation();
      case 2: return renderHighlightAnimation();
      case 3: return renderCalendarAnimation();
      case 4: return renderFinalAnimation();
      default: return renderNameSettingAnimation();
    }
  };

  return (
    <>
    <View style={styles.container}>
      <View style={styles.content}>
        {renderAnimation()}
        
        {currentStep < 4 && (
          <Animated.View 
            style={[
              styles.textContent,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }]
              }
            ]}
          >
            <Text style={styles.title}>{onboardingSteps[currentStep].title}</Text>
            <Text style={styles.subtitle}>{onboardingSteps[currentStep].subtitle}</Text>
          </Animated.View>
        )}
      </View>

      {currentStep < 4 && (
        <View style={styles.footer}>
          <TouchableOpacity 
            style={[
              styles.nextButton,
              currentStep === 0 && !userName.trim() && styles.nextButtonDisabled
            ]} 
            onPress={nextStep}
            activeOpacity={0.8}
            disabled={currentStep === 0 && !userName.trim()}
          >
          <Text style={[
            styles.nextButtonText,
            currentStep === 0 && !userName.trim() && styles.nextButtonTextDisabled
          ]}>
            {currentStep === 3 ? "시작하기" : "다음"}
          </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 80,
  },
  animationContainer: {
    height: height * 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  // 웰컴 화면
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF644C',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 25,
    elevation: 10,
  },
  logoImage: {
    width: 60,
    height: 60,
  },
  welcomeDecoration: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  floatingDot: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    opacity: 0.6,
  },
  personalizedText: {
    position: 'absolute',
    bottom: 50,
    alignItems: 'center',
  },
  userNameText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FF644C',
  },
  // 목업 컨테이너
  mockupContainer: {
    width: width * 0.8,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 10,
  },
  mockupHeader: {
    paddingBottom: 16,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  mockupTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
  },
  // 하이라이트 화면
  diaryContent: {
    marginBottom: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  diaryText: {
    fontSize: 16,
    lineHeight: 26,
    color: '#2C3E50',
  },
  highlightedText: {
    fontWeight: '600',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  aiSuggestion: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#FF644C',
  },
  suggestionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FF644C',
    marginBottom: 4,
  },
  suggestionText: {
    fontSize: 14,
    color: '#6B7280',
  },
  // 캘린더 화면
  calendarMockup: {
    width: width * 0.8,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 10,
  },
  calendarHeader: {
    paddingBottom: 16,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  calendarTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
  },
  weekRow: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  weekDay: {
    flex: 1,
    fontSize: 12,
    fontWeight: '500',
    color: '#8E8E93',
    textAlign: 'center',
  },
  calendarBody: {
    paddingTop: 10,
  },
  dateRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  dateItem: {
    flex: 1,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  todayItem: {
    backgroundColor: '#FF644C',
    borderRadius: 8,
    marginHorizontal: 3,
  },
  dateNum: {
    fontSize: 14,
    color: '#2C3E50',
    fontWeight: '400',
  },
  todayNum: {
    color: 'white',
    fontWeight: '600',
  },
  emojiIcon: {
    fontSize: 14,
    position: 'absolute',
    bottom: 4,
  },
  // 이름 설정 화면
  nameSettingContainer: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 20,
  },
  nameIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    shadowColor: '#FF644C',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  nameLogoImage: {
    width: 60,
    height: 60,
  },
  nameInputSection: {
    width: '100%',
    alignItems: 'center',
  },
  inputCard: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 24,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 2,
    borderColor: '#F0F0F0',
  },
  nameTextInput: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2C3E50',
    textAlign: 'center',
    paddingVertical: 8,
  },
  nameFeatures: {
    width: '100%',
    paddingHorizontal: 10,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  featureIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  featureIconText: {
    fontSize: 12,
  },
  featureText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  // 최종 환영 화면
  finalContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  finalLogoContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  finalLogoImage: {
    width: 70,
    height: 70,
  },
  appName: {
    fontSize: 42,
    color: '#FF644C',
    letterSpacing: 2,
    fontFamily: customFont,
  },
  finalTextContainer: {
    alignItems: 'center',
    fontFamily: customFont,
  },
  finalWelcomeText: {
    fontSize: 28,
    color: '#2C3E50',
    textAlign: 'center',
    lineHeight: 34,
    fontFamily: customFont,
  },
  finalSubText: {
    fontSize: 19,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 26,
    fontFamily: customFont,
  },
  textContent: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 30,
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 15,
    lineHeight: 36,
    fontFamily: customFont,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  footer: {
    paddingHorizontal: 30,
    paddingBottom: 50,
    alignItems: 'center',
  },
  nextButton: {
    backgroundColor: '#FF644C',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 40,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#FF644C',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  nextButtonDisabled: {
    backgroundColor: '#E8E8E8',
    shadowOpacity: 0.1,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  nextButtonTextDisabled: {
    color: '#B0B0B0',
  },
});

export default OnboardingScreen;