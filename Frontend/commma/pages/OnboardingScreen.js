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
  ScrollView,
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
  const nameInputAnim = useRef(new Animated.Value(0)).current;
  const welcomeTextAnim = useRef(new Animated.Value(0)).current;
  const aiFeedbackAnim = useRef(new Animated.Value(0)).current;

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
      title: "문장에서 느낀 감정을\n하이라이트해보세요",
      subtitle: "일기 문장에서 특정 단어나 문장에 감정을 \n표시할 수 있습니다",
      animation: 'highlight'
    },
    {
      id: 4,
      title: "AI 피드백으로\n놓친 감정을 발견해요",
      subtitle: "AI가 질문을 던져주면, 놓쳤던 감정을\n 돌아보고 일기를 수정해보세요",
      animation: 'ai'
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
      // AI 피드백 애니메이션
      aiFeedbackAnim.setValue(0);

      setTimeout(() => {
        Animated.timing(aiFeedbackAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }).start();
      }, 500);
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
          await saveOnboardingComplete();
          onComplete();
        });
      }, 500);
    }
  }, [currentStep]);

  const nextStep = async () => {
    if (currentStep === 0) {
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

        highlightAnim.setValue(0);
        questionFloatAnim.setValue(0);
        nameInputAnim.setValue(0);
        welcomeTextAnim.setValue(0);
        aiFeedbackAnim.setValue(0);

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
      const savedLoginData = await AsyncStorage.getItem('autoLoginData');
      if (!savedLoginData) {
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
        showAlert({
          title: '오류',
          message: '인증 정보가 없습니다.',
          type: 'error',
          buttons: [{ text: '확인', onPress: hideAlert }]
        });
        return;
      }

      const response = await fetch(`https://comma.gamja.cloud/v1/users?name=${encodeURIComponent(userName.trim())}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        const updatedLoginData = {
          ...loginData,
          name: userName.trim()
        };
        await AsyncStorage.setItem('autoLoginData', JSON.stringify(updatedLoginData));
      } else {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
    } catch (error) {
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
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
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

          <View style={styles.highlightGuide}>
            <Animated.View
              style={[
                styles.guideItem,
                {
                  opacity: highlightAnim,
                  transform: [{
                    translateY: highlightAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [20, 0]
                    })
                  }]
                }
              ]}
            >
              <Text style={styles.guideText}>💛 행복</Text>
            </Animated.View>
            <Animated.View
              style={[
                styles.guideItem,
                {
                  opacity: highlightAnim,
                  transform: [{
                    translateY: highlightAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [25, 0]
                    })
                  }]
                }
              ]}
            >
              <Text style={styles.guideText}>💚 평온</Text>
            </Animated.View>
          </View>
        </View>
      </ScrollView>
    </View>
  );

  const renderAiAnimation = () => (
    <Animated.View
      style={[
        styles.animationContainer,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }]
        }
      ]}
    >
      <View style={styles.mockupContainer}>
        <View style={styles.mockupHeader}>
          <Text style={styles.mockupTitle}>{userName}님의 일기</Text>
        </View>
        <View style={styles.diaryContent}>
          <Text style={styles.diaryText}>오늘은 정말 행복한 하루였다.</Text>
          <Text style={styles.diaryText}>친구와 함께 즐거운 시간을 보냈다.</Text>
          <Text style={[styles.diaryText]}>하지만 집에 오니 조금 아쉬웠다.</Text>
        </View>

        <Animated.View
          style={[
            styles.aiSuggestion,
            {
              opacity: aiFeedbackAnim,
              transform: [{
                translateY: aiFeedbackAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0]
                })
              }]
            }
          ]}
        >
          <Text style={styles.suggestionLabel}>AI 피드백</Text>
          <Text style={styles.suggestionText}>{userName}님, 친구와 함께 즐거운 시간을 보내며 어떤 감정을 느끼셨나요?</Text>
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
      case 3: return renderAiAnimation();
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
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
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
  mockupContainer: {
    width: width * 0.8,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    paddingTop: 16,
    marginTop: 50,
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
  highlightGuide: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  guideItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  guideText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  aiSuggestion: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#FF644C',
    marginBottom: 16,
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
    lineHeight: 20,
  },
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
  },
  nextButtonDisabled: {
    backgroundColor: '#E8E8E8',
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