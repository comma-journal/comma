import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
  Image
} from 'react-native';
import customFont from '../styles/fonts';

const { width, height } = Dimensions.get('window');

const OnboardingScreen = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const bookFlyAnim = useRef(new Animated.Value(0)).current;
  const highlightAnim = useRef(new Animated.Value(0)).current;
  const questionFloatAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  const onboardingSteps = [
    {
      id: 1,
      title: "감정을 기록하는\n특별한 공간",
      subtitle: "쉼표는 당신의 마음을 담는 디지털 일기장입니다",
      animation: 'welcome'
    },
    {
      id: 2,
      title: "AI가 감정을 찾아\n하이라이트해줘요",
      subtitle: "작성한 텍스트에서 감정이 담긴 부분을\n자동으로 색칠하고 질문을 제안합니다",
      animation: 'highlight'
    },
    {
      id: 3,
      title: "완성된 일기는\n감정별 책장으로",
      subtitle: "기쁨, 슬픔, 분노, 평온함...\n감정에 따라 색깔로 구분된 책이 됩니다",
      animation: 'bookfly'
    },
    {
      id: 4,
      title: "책장에서 감정의\n흐름을 확인하세요",
      subtitle: "날짜별로 정리된 감정 일기들로\n내 마음의 변화를 한눈에 볼 수 있어요",
      animation: 'bookshelf'
    }
  ];

  useEffect(() => {
    // 초기 애니메이션
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

  useEffect(() => {
    // 단계별 애니메이션
    if (currentStep === 1) {
      // 하이라이트 애니메이션 (2번째 페이지)
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
    } else if (currentStep === 2) {
      // 책이 날아가는 애니메이션 (3번째 페이지)
      bookFlyAnim.setValue(0);
      
      setTimeout(() => {
        Animated.timing(bookFlyAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }).start();
      }, 300);
    } else if (currentStep === 3) {
      // 책장이 왼쪽에서 슬라이드인 (4번째 페이지)
      slideAnim.setValue(0);
      
      setTimeout(() => {
        Animated.timing(slideAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }).start();
      }, 200);
    }
  }, [currentStep]);

  const nextStep = () => {
    if (currentStep < onboardingSteps.length - 1) {
      // 부드러운 페이지 전환 애니메이션
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
        bookFlyAnim.setValue(0);
        slideAnim.setValue(0);
        
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
    } else {
      onComplete();
    }
  };

  const skip = () => {
    onComplete();
  };

  const renderWelcomeAnimation = () => (
    <Animated.View style={[styles.animationContainer, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/logo.png')}
          style={styles.onboardingLogo}
          resizeMode="contain"
        />
      </View>
      <View style={styles.welcomeDecoration}>
        <View style={[styles.floatingDot, { backgroundColor: '#FFB5BA', top: 50, left: 30 }]} />
        <View style={[styles.floatingDot, { backgroundColor: '#B5D8FF', top: 80, right: 40 }]} />
        <View style={[styles.floatingDot, { backgroundColor: '#C8E6C9', bottom: 60, left: 50 }]} />
      </View>
    </Animated.View>
  );

  const renderHighlightAnimation = () => (
    <View style={styles.animationContainer}>
      <View style={styles.diaryContainer}>
        <View style={styles.diaryHeader}>
          <Text style={styles.diaryTitle}>제목 섹션</Text>
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
          
          <Text style={[styles.diaryText, { marginTop: 8 }]}>친구와 함께 </Text>
          <Animated.Text 
            style={[
              styles.diaryText, 
              styles.highlightedText,
              {
                backgroundColor: highlightAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['transparent', '#A8E6CF']
                }),
                marginTop: 8
              }
            ]}
          >
            즐거운 시간
          </Animated.Text>
          <Text style={styles.diaryText}>을 보냈다.</Text>
          
          {/* 플로팅 질문 */}
          <Animated.View 
            style={[
              styles.floatingQuestion,
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
            <Text style={styles.questionText}>어떤 순간이 가장 행복했나요?</Text>
            <View style={styles.questionArrow} />
          </Animated.View>
        </View>
      </View>
    </View>
  );

  const renderBookFlyAnimation = () => (
    <Animated.View 
      style={[
        styles.animationContainer,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }]
        }
      ]}
    >
      <View style={styles.bookFlyContainer}>
        {/* 상단 텍스트 */}
        <Text style={styles.bookFlyTopText}>일기가 완성되면</Text>
        
        {/* 작성 완료된 일기 */}
        <Animated.View 
          style={[
            styles.completedDiary,
            {
              transform: [{
                translateX: bookFlyAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, width * 0.25]
                })
              }, {
                translateY: bookFlyAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -80]
                })
              }, {
                scale: bookFlyAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 0.7]
                })
              }]
            }
          ]}
        >
          <Text style={styles.completedDiaryText}>오늘의 일기</Text>
        </Animated.View>
        
        {/* 화살표 */}
        <Animated.View 
          style={[
            styles.flyingArrow,
            {
              opacity: bookFlyAnim.interpolate({
                inputRange: [0, 0.3, 1],
                outputRange: [0, 1, 0]
              })
            }
          ]}
        >
          <Text style={styles.arrowText}>→</Text>
        </Animated.View>
        
        {/* 책장 */}
        <View style={styles.miniBookshelf}>
          <Text style={styles.bookshelfLabel}>감정별 책장</Text>
          <View style={styles.miniShelf}>
            <View style={[styles.miniBook, { backgroundColor: '#FF6B9D' }]} />
            <View style={[styles.miniBook, { backgroundColor: '#4ECDC4' }]} />
            <View style={[styles.miniBook, { backgroundColor: '#FFB366' }]} />
            <View style={[styles.miniBook, { backgroundColor: '#96CEB4' }]} />
          </View>
        </View>
      </View>
    </Animated.View>
  );

  const renderBookshelfAnimation = () => (
    <Animated.View 
      style={[
        styles.animationContainer,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }]
        }
      ]}
    >
      <Animated.View 
        style={[
          styles.finalBookshelfContainer,
          {
            transform: [{
              translateX: slideAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [-width, 0]
              })
            }],
            opacity: slideAnim
          }
        ]}
      >
        <Text style={styles.bookshelfTitle}>8월의 감정 책장</Text>
        
        {/* 실제 책장 */}
        <View style={styles.modernBookshelf}>
          
          {/* 첫 번째 선반 */}
          <Animated.View 
            style={[
              styles.shelfSection,
              {
                opacity: slideAnim,
                transform: [{
                  translateY: slideAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0]
                  })
                }]
              }
            ]}
          >
            <View style={styles.woodenShelf} />
            <View style={styles.booksRow}>
              <View style={[styles.realisticBook, { backgroundColor: '#FF6B9D', transform: [{ rotateY: '5deg' }] }]}>
                <View style={styles.bookSpine} />
                <View style={styles.bookTop} />
                <Text style={styles.bookDateText}>1</Text>
              </View>
              <View style={[styles.realisticBook, { backgroundColor: '#4ECDC4' }]}>
                <View style={styles.bookSpine} />
                <View style={styles.bookTop} />
                <Text style={styles.bookDateText}>2</Text>
              </View>
              <View style={[styles.realisticBook, { backgroundColor: '#FFB366', transform: [{ rotateY: '-3deg' }] }]}>
                <View style={styles.bookSpine} />
                <View style={styles.bookTop} />
                <Text style={styles.bookDateText}>3</Text>
              </View>
              <View style={[styles.realisticBook, { backgroundColor: '#96CEB4' }]}>
                <View style={styles.bookSpine} />
                <View style={styles.bookTop} />
                <Text style={styles.bookDateText}>4</Text>
              </View>
              <View style={[styles.realisticBook, { backgroundColor: '#FF6B9D', transform: [{ rotateY: '4deg' }] }]}>
                <View style={styles.bookSpine} />
                <View style={styles.bookTop} />
                <Text style={styles.bookDateText}>5</Text>
              </View>
            </View>
          </Animated.View>

          {/* 두 번째 선반 */}
          <Animated.View 
            style={[
              styles.shelfSection,
              {
                opacity: slideAnim,
                transform: [{
                  translateY: slideAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [30, 0]
                  })
                }]
              }
            ]}
          >
            <View style={styles.woodenShelf} />
            <View style={styles.booksRow}>
              <View style={[styles.realisticBook, { backgroundColor: '#96CEB4', transform: [{ rotateY: '-2deg' }] }]}>
                <View style={styles.bookSpine} />
                <View style={styles.bookTop} />
                <Text style={styles.bookDateText}>6</Text>
              </View>
              <View style={[styles.realisticBook, { backgroundColor: '#4ECDC4' }]}>
                <View style={styles.bookSpine} />
                <View style={styles.bookTop} />
                <Text style={styles.bookDateText}>7</Text>
              </View>
              <View style={[styles.realisticBook, { backgroundColor: '#FFB366', transform: [{ rotateY: '6deg' }] }]}>
                <View style={styles.bookSpine} />
                <View style={styles.bookTop} />
                <Text style={styles.bookDateText}>8</Text>
              </View>
              <View style={[styles.realisticBook, { backgroundColor: '#FF6B9D' }]}>
                <View style={styles.bookSpine} />
                <View style={styles.bookTop} />
                <Text style={styles.bookDateText}>9</Text>
              </View>
            </View>
          </Animated.View>

          {/* 세 번째 선반 */}
          <Animated.View 
            style={[
              styles.shelfSection,
              {
                opacity: slideAnim,
                transform: [{
                  translateY: slideAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [40, 0]
                  })
                }]
              }
            ]}
          >
            <View style={styles.woodenShelf} />
            <View style={styles.booksRow}>
              <View style={[styles.realisticBook, { backgroundColor: '#96CEB4' }]}>
                <View style={styles.bookSpine} />
                <View style={styles.bookTop} />
                <Text style={styles.bookDateText}>10</Text>
              </View>
              <View style={[styles.realisticBook, { backgroundColor: '#4ECDC4', transform: [{ rotateY: '3deg' }] }]}>
                <View style={styles.bookSpine} />
                <View style={styles.bookTop} />
                <Text style={styles.bookDateText}>11</Text>
              </View>
              <View style={[styles.realisticBook, { backgroundColor: '#FF6B9D', transform: [{ rotateY: '-4deg' }] }]}>
                <View style={styles.bookSpine} />
                <View style={styles.bookTop} />
                <Text style={styles.bookDateText}>12</Text>
              </View>
            </View>
          </Animated.View>
        </View>
        
        <Animated.View 
          style={[
            styles.emotionLegend,
            {
              opacity: slideAnim.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [0, 0, 1]
              })
            }
          ]}
        >
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#FF6B9D' }]} />
            <Text style={styles.legendText}>기쁨</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#4ECDC4' }]} />
            <Text style={styles.legendText}>슬픔</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#FFB366' }]} />
            <Text style={styles.legendText}>감사</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#96CEB4' }]} />
            <Text style={styles.legendText}>평온</Text>
          </View>
        </Animated.View>
      </Animated.View>
    </Animated.View>
  );

  const renderAnimation = () => {
    switch (currentStep) {
      case 0: return renderWelcomeAnimation();
      case 1: return renderHighlightAnimation();
      case 2: return renderBookFlyAnimation();
      case 3: return renderBookshelfAnimation();
      default: return renderWelcomeAnimation();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={skip} style={styles.skipButton}>
          <Text style={styles.skipText}>건너뛰기</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {renderAnimation()}
        
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
      </View>

      <View style={styles.footer}>
        <View style={styles.pagination}>
          {onboardingSteps.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                { opacity: index === currentStep ? 1 : 0.3 }
              ]}
            />
          ))}
        </View>

        <TouchableOpacity 
          style={styles.nextButton} 
          onPress={nextStep}
          activeOpacity={0.8}
        >
          <Text style={styles.nextButtonText}>
            {currentStep === onboardingSteps.length - 1 ? '시작하기' : '다음'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 10,
  },
  skipButton: {
    padding: 10,
  },
  skipText: {
    color: '#70A1FF',
    fontSize: 16,
    fontWeight: '500',
    fontFamily: customFont,
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
  },
  animationContainer: {
    height: height * 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 40,
    padding: 25,
    shadowColor: '#70A1FF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  onboardingLogo: {
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
    width: 20,
    height: 20,
    borderRadius: 10,
    opacity: 0.6,
  },
  // 하이라이트 애니메이션 스타일
  diaryContainer: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  diaryHeader: {
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
    paddingBottom: 12,
    marginBottom: 16,
  },
  diaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    fontFamily: customFont,
  },
  diaryContent: {
    position: 'relative',
  },
  diaryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  diaryText: {
    fontSize: 16,
    lineHeight: 28,
    color: '#2C3E50',
    fontFamily: customFont,
  },
  highlightedText: {
    fontWeight: '600',
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  floatingQuestion: {
    position: 'absolute',
    right: -20,
    top: 40,
    backgroundColor: '#70A1FF',
    borderRadius: 12,
    padding: 12,
    maxWidth: 180,
    shadowColor: '#70A1FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  questionText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
    fontFamily: customFont,
  },
  questionArrow: {
    position: 'absolute',
    left: -8,
    top: 20,
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#70A1FF',
    transform: [{ rotate: '45deg' }],
  },
  // 책 날아가는 애니메이션 스타일
  bookFlyContainer: {
    width: '100%',
    alignItems: 'center',
    position: 'relative',
    paddingVertical: 20,
  },
  bookFlyTopText: {
    fontSize: 16,
    color: '#7F8C8D',
    marginBottom: 30,
    textAlign: 'center',
    fontFamily: customFont,
  },
  completedDiary: {
    backgroundColor: '#FFE066',
    borderRadius: 8,
    padding: 20,
    width: 100,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 40,
  },
  completedDiaryText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    fontFamily: customFont,
  },
  flyingArrow: {
    position: 'absolute',
    top: '45%',
    left: '60%',
  },
  arrowText: {
    fontSize: 24,
    color: '#70A1FF',
    fontWeight: 'bold',
    fontFamily: customFont,
  },
  miniBookshelf: {
    alignItems: 'center',
    position: 'absolute',
    right: 20,
    top: 70,
  },
  bookshelfLabel: {
    fontSize: 12,
    color: '#7F8C8D',
    marginBottom: 8,
    textAlign: 'center',
    fontFamily: customFont,
  },
  miniShelf: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#F8F9FA',
    borderRadius: 6,
    padding: 8,
    width: 80,
    height: 50,
  },
  miniBook: {
    width: 12,
    height: 35,
    borderRadius: 2,
    marginHorizontal: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  // 책장 애니메이션 스타일
  finalBookshelfContainer: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  bookshelfTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 24,
    fontFamily: customFont,
  },
  modernBookshelf: {
    backgroundColor: '#F8F4E6',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  shelfSection: {
    marginBottom: 20,
  },
  woodenShelf: {
    height: 12,
    backgroundColor: '#D4A574',
    borderRadius: 6,
    marginBottom: 8,
    shadowColor: '#8B4513',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 3,
    borderBottomWidth: 2,
    borderBottomColor: '#C19A58',
  },
  booksRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    height: 80,
    paddingBottom: 8,
  },
  realisticBook: {
    width: 32,
    height: 70,
    borderRadius: 4,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  bookSpine: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
  },
  bookTop: {
    position: 'absolute',
    top: -2,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  bookDateText: {
    position: 'absolute',
    bottom: 8,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: 'white',
    fontSize: 11,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  emotionLegend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 2,
    marginRight: 4,
  },
  legendText: {
    fontSize: 11,
    color: '#7F8C8D',
    fontWeight: '500',
    fontFamily: customFont,
  },
  textContent: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '300',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 15,
    lineHeight: 36,
    fontFamily: customFont,
  },
  subtitle: {
    fontSize: 16,
    color: '#7F8C8D',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
    fontFamily: customFont,
  },
  footer: {
    paddingHorizontal: 30,
    paddingBottom: 50,
    alignItems: 'center',
  },
  pagination: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#70A1FF',
    marginHorizontal: 4,
  },
  nextButton: {
    backgroundColor: '#70A1FF',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 40,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#70A1FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: customFont,
  },
});

export default OnboardingScreen;