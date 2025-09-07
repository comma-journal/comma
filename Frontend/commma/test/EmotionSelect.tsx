// EmotionSelect.tsx
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Animated,
  Dimensions,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Easing,
  TouchableWithoutFeedback,
} from 'react-native';

const { width, height } = Dimensions.get('window');

interface Emotion {
  id: string;
  name: string;
  color: string;
  gradient: [string, string];
}

const emotions: Emotion[] = [
  // 1행: 빨강 -> 주황 그라데이션
  { id: '1', name: '열정', color: '#FF2D2D', gradient: ['#FF2D2D', '#FF4444'] },
  { id: '2', name: '흥분', color: '#FF4444', gradient: ['#FF4444', '#FF5C33'] },
  { id: '3', name: '활기', color: '#FF6633', gradient: ['#FF6633', '#FF7F2A'] },
  { id: '4', name: '기쁨', color: '#FF8C1A', gradient: ['#FF8C1A', '#FF9900'] },
  { id: '5', name: '환희', color: '#FFB300', gradient: ['#FFB300', '#FFCC00'] },

  // 2행: 주황 -> 노랑 그라데이션 (1행과 자연스럽게 연결)
  { id: '6', name: '분노', color: '#E62E2E', gradient: ['#E62E2E', '#FF4D4D'] },
  { id: '7', name: '격분', color: '#FF4D4D', gradient: ['#FF4D4D', '#FF6640'] },
  { id: '8', name: '화남', color: '#FF7A40', gradient: ['#FF7A40', '#FF9933'] },
  { id: '9', name: '짜증', color: '#FFB333', gradient: ['#FFB333', '#FFCC33'] },
  { id: '10', name: '희망', color: '#FFDD33', gradient: ['#FFDD33', '#FFEE00'] },

  // 3행: 노랑 -> 연두 그라데이션
  { id: '11', name: '경멸', color: '#CC3333', gradient: ['#CC3333', '#E64D4D'] },
  { id: '12', name: '혐오', color: '#E64D4D', gradient: ['#E64D4D', '#FF6B47'] },
  { id: '13', name: '불만', color: '#FF8547', gradient: ['#FF8547', '#FFAA47'] },
  { id: '14', name: '피로', color: '#FFCC47', gradient: ['#FFCC47', '#FFEE47'] },
  { id: '15', name: '만족', color: '#EEFF47', gradient: ['#EEFF47', '#CCFF47'] },

  // 4행: 연두 -> 초록 그라데이션
  { id: '16', name: '실망', color: '#B33333', gradient: ['#B33333', '#CC5555'] },
  { id: '17', name: '우울', color: '#CC6655', gradient: ['#CC6655', '#E68855'] },
  { id: '18', name: '무력감', color: '#FFAA55', gradient: ['#FFAA55', '#FFCC77'] },
  { id: '19', name: '안정', color: '#CCDD77', gradient: ['#CCDD77', '#AAEE77'] },
  { id: '20', name: '성장', color: '#88FF77', gradient: ['#88FF77', '#66FF88'] },

  // 5행: 초록 그라데이션
  { id: '21', name: '슬픔', color: '#994444', gradient: ['#994444', '#BB6666'] },
  { id: '22', name: '침울', color: '#BB7766', gradient: ['#BB7766', '#CC9977'] },
  { id: '23', name: '지루함', color: '#DDBB77', gradient: ['#DDBB77', '#DDCC99'] },
  { id: '24', name: '평화', color: '#BBDD99', gradient: ['#BBDD99', '#99DD99'] },
  { id: '25', name: '조화', color: '#77DD99', gradient: ['#77DD99', '#55DDAA'] },

  // 6행: 초록 -> 청록 그라데이션
  { id: '26', name: '절망', color: '#775555', gradient: ['#775555', '#996666'] },
  { id: '27', name: '공허', color: '#997788', gradient: ['#997788', '#AA8899'] },
  { id: '28', name: '무관심', color: '#BB9999', gradient: ['#BB9999', '#CCAAAA'] },
  { id: '29', name: '신뢰', color: '#AACCAA', gradient: ['#AACCAA', '#88CCAA'] },
  { id: '30', name: '균형', color: '#66CCBB', gradient: ['#66CCBB', '#44CCCC'] },

  // 7행: 청록 -> 파랑 그라데이션
  { id: '31', name: '외로움', color: '#556677', gradient: ['#556677', '#667788'] },
  { id: '32', name: '고독', color: '#6688AA', gradient: ['#6688AA', '#7799BB'] },
  { id: '33', name: '냉정', color: '#88AABB', gradient: ['#88AABB', '#99BBCC'] },
  { id: '34', name: '평온', color: '#99CCDD', gradient: ['#99CCDD', '#77AADD'] },
  { id: '35', name: '고요', color: '#5588CC', gradient: ['#5588CC', '#3366BB'] },

  // 8행: 파랑 그라데이션
  { id: '36', name: '불안', color: '#445577', gradient: ['#445577', '#556688'] },
  { id: '37', name: '의심', color: '#556699', gradient: ['#556699', '#6677AA'] },
  { id: '38', name: '집중', color: '#6688BB', gradient: ['#6688BB', '#7799CC'] },
  { id: '39', name: '사색', color: '#7799DD', gradient: ['#7799DD', '#6688CC'] },
  { id: '40', name: '깊이', color: '#5577BB', gradient: ['#5577BB', '#4466AA'] },

  // 9행: 파랑 -> 보라 그라데이션
  { id: '41', name: '두려움', color: '#334466', gradient: ['#334466', '#445577'] },
  { id: '42', name: '공포', color: '#445588', gradient: ['#445588', '#556699'] },
  { id: '43', name: '경악', color: '#5566AA', gradient: ['#5566AA', '#6677BB'] },
  { id: '44', name: '신비', color: '#6677CC', gradient: ['#6677CC', '#7766BB'] },
  { id: '45', name: '영감', color: '#7755AA', gradient: ['#7755AA', '#884499'] },

  // 10행: 보라 -> 핑크 그라데이션 (1행으로 자연스럽게 연결)
  { id: '46', name: '혼란', color: '#443355', gradient: ['#443355', '#554466'] },
  { id: '47', name: '당황', color: '#554477', gradient: ['#554477', '#665588'] },
  { id: '48', name: '충격', color: '#665599', gradient: ['#665599', '#7766AA'] },
  { id: '49', name: '사랑', color: '#8866AA', gradient: ['#8866AA', '#AA5588'] },
  { id: '50', name: '애정', color: '#CC4466', gradient: ['#CC4466', '#DD3355'] },
];

const EmotionSelect: React.FC = () => {
  const [selectedEmotion, setSelectedEmotion] = useState<Emotion | null>(null);
  const [hoveredEmotion, setHoveredEmotion] = useState<string | null>(null);
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  // ScrollView ref 추가
  const scrollViewRef = useRef<ScrollView>(null);

  // 각 카드별 애니메이션 값들
  const cardAnimations = useRef(
    emotions.map(() => ({
      scale: new Animated.Value(1),
      translateY: new Animated.Value(0),
      opacity: new Animated.Value(1),
      rotate: new Animated.Value(0),
      translateX: new Animated.Value(0),
    }))
  ).current;

  // 카드 크기 및 레이아웃 상수
  const cardWidth = width / 5 - 14; // 2px씩 줄어든 크기
  const cardHeight = 66; // 2px씩 줄어든 크기
  const totalGridWidth = cardWidth * 5 + 32; // 5개 카드 + 간격
  const startX = (width - totalGridWidth) / 2; // 중앙 정렬

  // 부드러운 플로팅 효과
  useEffect(() => {
    if (!isSelectionMode) {
      const floatingAnimations = cardAnimations.map((anim, index) => {
        const floatDistance = Math.sin(index * 0.5) * 6;
        
        return Animated.loop(
          Animated.sequence([
            Animated.timing(anim.translateY, {
              toValue: floatDistance,
              duration: 2500 + (index % 5) * 150,
              easing: Easing.inOut(Easing.sin),
              useNativeDriver: true,
            }),
            Animated.timing(anim.translateY, {
              toValue: -floatDistance,
              duration: 2500 + (index % 5) * 150,
              easing: Easing.inOut(Easing.sin),
              useNativeDriver: true,
            }),
            Animated.timing(anim.translateY, {
              toValue: 0,
              duration: 1250 + (index % 5) * 75,
              easing: Easing.inOut(Easing.sin),
              useNativeDriver: true,
            }),
          ])
        );
      });

      floatingAnimations.forEach(anim => anim.start());

      return () => {
        floatingAnimations.forEach(anim => anim.stop());
      };
    }
  }, [isSelectionMode]);

  // 카드 호버 효과
  const handleCardHover = (emotionId: string, isHover: boolean) => {
    if (isSelectionMode) return;

    const index = emotions.findIndex(e => e.id === emotionId);
    if (index === -1) return;

    setHoveredEmotion(isHover ? emotionId : null);

    Animated.parallel([
      Animated.spring(cardAnimations[index].scale, {
        toValue: isHover ? 1.08 : 1,
        friction: 8,
        tension: 300,
        useNativeDriver: true,
      }),
      Animated.timing(cardAnimations[index].translateY, {
        toValue: isHover ? -8 : 0,
        duration: 200,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();
  };

  // 감정 선택 처리
  const handleEmotionSelect = (emotion: Emotion) => {
    if (selectedEmotion && (selectedEmotion.id === emotion.id || isSelectionMode)) {
      handleReset();
      return;
    }

    setSelectedEmotion(emotion);
    setIsSelectionMode(true);
    
    const selectedIndex = emotions.findIndex(e => e.id === emotion.id);
    const selectedRow = Math.floor(selectedIndex / 5);
    const selectedCol = selectedIndex % 5;

    // 선택된 카드의 현재 위치 (스크롤 고려)
    const currentX = startX + selectedCol * (cardWidth + 8);
    const currentY = selectedRow * 85 + 30; // 컨테이너 패딩 포함

    // 화면의 실제 중앙 계산 (헤더와 하단 UI 고려)
    const headerHeight = 100; // 헤더 높이 추정
    const bottomHeight = 140; // 하단 선택 정보 + 상태바 높이
    const availableHeight = height - headerHeight - bottomHeight;
    
    const screenCenterX = width / 2;
    const screenCenterY = headerHeight + availableHeight / 3;

    // 카드 중심점을 화면 중심으로 이동할 거리 계산
    const moveX = screenCenterX - currentX - cardWidth / 2;
    const moveY = screenCenterY - currentY - cardHeight / 2;

    // 스크롤을 맨 위로 이동
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });

    // 약간의 지연 후 애니메이션 시작 (스크롤 완료 대기)
    setTimeout(() => {
      Animated.parallel([
        // 선택된 카드 중앙 이동 및 확대
        Animated.spring(cardAnimations[selectedIndex].scale, {
          toValue: 3,
          friction: 6,
          tension: 150,
          useNativeDriver: true,
        }),
        Animated.spring(cardAnimations[selectedIndex].translateX, {
          toValue: moveX,
          friction: 8,
          tension: 150,
          useNativeDriver: true,
        }),
        Animated.spring(cardAnimations[selectedIndex].translateY, {
          toValue: moveY,
          friction: 8,
          tension: 150,
          useNativeDriver: true,
        }),
        Animated.timing(cardAnimations[selectedIndex].rotate, {
          toValue: 1,
          duration: 800,
          easing: Easing.out(Easing.back(1.2)),
          useNativeDriver: true,
        }),
        // 다른 카드들 페이드아웃
        ...cardAnimations.map((anim, index) => {
          if (index !== selectedIndex) {
            return Animated.parallel([
              Animated.timing(anim.opacity, {
                toValue: 0.8,
                duration: 500,
                useNativeDriver: true,
              }),
              Animated.spring(anim.scale, {
                toValue: 0.8,
                friction: 8,
                useNativeDriver: true,
              }),
            ]);
          }
          return Animated.timing(new Animated.Value(0), { toValue: 0, duration: 0, useNativeDriver: true });
        }),
      ]).start();
    }, 300); // 스크롤 애니메이션 완료 대기
  };

  // 배경 터치 시 초기화
  const handleBackgroundPress = () => {
    if (selectedEmotion) {
      handleReset();
    }
  };

  // 선택 초기화
  const handleReset = () => {
    setSelectedEmotion(null);
    setIsSelectionMode(false);

    Animated.parallel([
      // 모든 카드 원상복구
      ...cardAnimations.map(anim =>
        Animated.parallel([
          Animated.spring(anim.scale, { toValue: 1, useNativeDriver: true }),
          Animated.timing(anim.opacity, { toValue: 1, duration: 400, useNativeDriver: true }),
          Animated.timing(anim.rotate, { toValue: 0, duration: 400, useNativeDriver: true }),
          Animated.spring(anim.translateX, { toValue: 0, useNativeDriver: true }),
          Animated.spring(anim.translateY, { toValue: 0, useNativeDriver: true }),
        ])
      ),
    ]).start();
  };

  const renderEmotionCard = (emotion: Emotion, index: number) => {
    const row = Math.floor(index / 5);
    const col = index % 5;
    
    return (
      <Animated.View
        key={emotion.id}
        style={[
          styles.card,
          {
            left: startX + col * (cardWidth + 8), // 중앙 정렬된 위치
            top: row * 85,
            width: cardWidth, // 줄어든 크기 적용
            height: cardHeight, // 줄어든 크기 적용
            backgroundColor: emotion.color,
            zIndex: selectedEmotion?.id === emotion.id ? 1000 : 1,
            transform: [
              { translateX: cardAnimations[index].translateX },
              { translateY: cardAnimations[index].translateY },
              { scale: cardAnimations[index].scale },
              {
                rotate: cardAnimations[index].rotate.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '5deg'],
                }),
              },
            ],
            opacity: cardAnimations[index].opacity,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.cardTouchArea}
          activeOpacity={0.9}
          onPress={() => handleEmotionSelect(emotion)}
          onPressIn={() => handleCardHover(emotion.id, true)}
          onPressOut={() => handleCardHover(emotion.id, false)}
        >
          <Text style={[
            styles.cardText,
            {
              fontSize: selectedEmotion?.id === emotion.id ? 18 : 11,
              fontWeight: selectedEmotion?.id === emotion.id ? '900' : '800',
            }
          ]}>
            {emotion.name}
          </Text>
          {selectedEmotion?.id === emotion.id && (
            <View style={styles.selectedBadge}>
              <Text style={styles.selectedBadgeText}>✓</Text>
            </View>
          )}
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.title}>✨ Modern Emotion Selector</Text>
        <Text style={styles.subtitle}>카드를 터치하여 감정을 선택하세요</Text>
      </View>

      {/* 감정 카드 그리드 */}
      <TouchableWithoutFeedback onPress={handleBackgroundPress}>
        <View style={styles.scrollContainer}>
          <ScrollView 
            ref={scrollViewRef}
            showsVerticalScrollIndicator={false}
            scrollEnabled={!isSelectionMode}
            style={{ flex: 1 }}
          >
            <View style={styles.cardContainer}>
              {emotions.map(renderEmotionCard)}
            </View>
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>

      {/* 선택 정보 */}
      {selectedEmotion && (
        <View style={styles.simpleSelectionInfo}>
          <Text style={styles.simpleSelectionText}>
            선택됨: <Text style={[styles.selectedEmotionName, { color: selectedEmotion.color }]}>
              {selectedEmotion.name}
            </Text>
          </Text>
          <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
            <Text style={styles.resetButtonText}>다시 선택하기</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* 상태 인디케이터 */}
      <View style={styles.statusBar}>
        <View style={[styles.statusDot, { backgroundColor: selectedEmotion ? selectedEmotion.color : '#10b981' }]} />
        <Text style={styles.statusText}>
          {selectedEmotion ? `${selectedEmotion.name} 선택됨` : `${emotions.length}개 감정 중 선택하세요`}
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 25,
    paddingHorizontal: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a202c',
    marginBottom: 5,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: '#64748b',
    fontWeight: '400',
  },
  scrollContainer: {
    flex: 1,
  },
  cardContainer: {
    position: 'relative',
    height: Math.ceil(emotions.length / 5) * 85 + 50,
    paddingHorizontal: 20, // 여유 공간 증가
    paddingVertical: 30, // 여유 공간 증가
  },
  card: {
    position: 'absolute',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 10,
  },
  cardTouchArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },
  cardText: {
    color: '#ffffff',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  selectedBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  selectedBadgeText: {
    color: '#10b981',
    fontSize: 14,
    fontWeight: '700',
  },
  simpleSelectionInfo: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: '#f8fafc',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  simpleSelectionText: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 12,
  },
  selectedEmotionName: {
    fontWeight: '800',
    fontSize: 18,
  },
  resetButton: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
  },
  resetButtonText: {
    color: '#64748b',
    fontSize: 14,
    fontWeight: '600',
  },
  statusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#f1f5f9',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 8,
  },
  statusText: {
    color: '#475569',
    fontSize: 13,
    fontWeight: '500',
  },
});

export default EmotionSelect;