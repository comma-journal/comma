import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image
} from 'react-native';
import { SvgXml } from 'react-native-svg';
import LinearGradient from 'react-native-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import { useNavigation } from '@react-navigation/native';
import homeStyles from '../styles/HomeScreenStyle';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [selectedDate, setSelectedDate] = useState('');
  const [currentDate, setCurrentDate] = useState(new Date(2025, 8, 1));

  // 일기 데이터 (실제로는 API에서 가져올 예정) - 기분 정보 추가
  const [diaryData] = useState({
    '2025-09-02': { hasEntry: true, mood: 'happy' },
    '2025-09-03': { hasEntry: true, mood: 'sad' },
    '2025-09-06': { hasEntry: true, mood: 'angry' },
    '2025-09-15': { hasEntry: true, mood: 'happy' },
    '2025-09-16': { hasEntry: true, mood: 'excited' },
    '2025-09-17': { hasEntry: true, mood: 'calm' },
    '2025-09-18': { hasEntry: true, mood: 'worried' },
    '2025-09-19': { hasEntry: true, mood: 'happy' },
    '2025-09-21': { hasEntry: true, mood: 'sad' },
    '2025-09-22': { hasEntry: true, mood: 'excited' },
    '2025-09-23': { hasEntry: true, mood: 'calm' },
    '2025-09-24': { hasEntry: true, mood: 'angry' },
    '2025-09-25': { hasEntry: true, mood: 'happy' },
    '2025-09-26': { hasEntry: true, mood: 'worried' },
    '2025-09-29': { hasEntry: true, mood: 'excited' },
  });

  // 오늘 날짜
  const today = new Date();
  const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  // 날짜 클릭 핸들러
  const handleDatePress = (dateKey, dayData) => {
    setSelectedDate(dateKey);
    console.log('선택된 날짜:', dateKey, '기분:', dayData?.mood);


    navigation.navigate('WriteTab', { screen: 'WriteList' });
  };

  // 월 포맷팅
  const getMonthYear = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    return `${year}년 ${month}월`;
  };

  // 이전/다음 달로 이동
  const goToPreviousMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDate(newDate);
  };

  const goToNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  // 달력 날짜 생성
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    const days = [];

    // 이전 달의 빈 칸
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(null);
    }

    // 이번 달의 모든 날짜
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    // 마지막 주를 7개로 맞추기
    while (days.length % 7 !== 0) {
      days.push(null);
    }

    return days;
  };

  // 기분별 그라데이션 색상 정의
  const getMoodGradient = (mood) => {
    const gradients = {
      'happy': ['#FFF6CC', '#FFEA89', '#FFB700'],
      'excited': ['#FFCC99', '#FF9966', '#FF6B35'],
      'calm': ['#B3B8FF', '#8A87FF', '#5352ED'],
      'sad': ['#D0D7E0', '#A0A8B0', '#57606F'],
      'angry': ['#FFB3B3', '#FF7A73', '#EE5A52'],
      'worried': ['#E5B3D9', '#C768A0', '#A53860'],
      'love': ['#FFE2FD', '#FFB6F0', '#F15BFF'],
      'tired': ['#C8D2D8', '#A8B2B8', '#7F8C8D'],
    };
    return gradients[mood] || ['#F0F0F0', '#E0E0E0', '#CCCCCC'];
  };

  // 기분별 눈코입 색상 반환
  const getMoodColors = (mood) => {
    const colors = {
      'happy': { eye: '#8B4513', mouth: '#FF8C00' },
      'excited': { eye: '#8B4513', mouth: '#FF4500' },
      'calm': { eye: '#4A4A4A', mouth: '#87CEEB' },
      'sad': { eye: '#555555', mouth: '#708090' },
      'angry': { eye: '#8B0000', mouth: '#DC143C' },
      'worried': { eye: '#4B0082', mouth: '#9370DB' },
      'love': { eye: '#8B4513', mouth: '#FF69B4' },
      'tired': { eye: '#696969', mouth: '#A9A9A9' },
    };
    return colors[mood] || { eye: '#6B4200', mouth: '#FBBE25' };
  };

  // 기분별 입 모양 반환
  const getMouthPath = (mood) => {
    const paths = {
      'happy': 'M18 24C22 28, 38 28, 42 24',           // 웃는 입
      'excited': 'M16 22C22 30, 38 30, 44 22',         // 활짝 웃는 입
      'calm': 'M22 26L38 26',                          // 일직선 입
      'sad': 'M18 28C22 24, 38 24, 42 28',            // 슬픈 입 (아래로)
      'angry': 'M20 28L40 28',                         // 화난 입 (일직선, 두꺼움)
      'worried': 'M20 26C25 24, 35 24, 40 26',        // 걱정스러운 입 (살짝 위로)
      'love': 'M18 22C22 30, 38 30, 42 22',           // 하트 모양 웃음
      'tired': 'M20 27C25 25, 35 25, 40 27',          // 피곤한 입 (살짝 처진)
    };
    return paths[mood] || 'M18 24C22 28, 38 28, 42 24';
  };

  // 기분별 stroke-width 반환
  const getMouthStrokeWidth = (mood) => {
    const widths = {
      'happy': 4,
      'excited': 5,     // 더 두껍게
      'calm': 3,        // 얇게
      'sad': 4,
      'angry': 5,       // 더 두껍게
      'worried': 3,     // 얇게
      'love': 4,
      'tired': 3,       // 얇게
    };
    return widths[mood] || 4;
  };

  // 눈코입 SVG 컴포넌트 (기분별 입 모양 적용)
  const EyesMouthSvg = ({ size = 24, mood = 'happy' }) => {
    const moodColors = getMoodColors(mood);
    const mouthPath = getMouthPath(mood);
    const strokeWidth = getMouthStrokeWidth(mood);

    const svgXml = `
      <svg width="${size}" height="${size * 0.6}" viewBox="0 0 60 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="18" cy="12" r="4" fill="${moodColors.eye}"/>
        <circle cx="42" cy="12" r="4" fill="${moodColors.eye}"/>
        <path d="${mouthPath}" stroke="${moodColors.mouth}" stroke-width="${strokeWidth}" stroke-linecap="round"/>
      </svg>
    `;

    return <SvgXml xml={svgXml} width={size} height={size * 0.6} />;
  };

  // 그라데이션 적용된 로고 아이콘 (눈코입 추가)
  const LogoIcon = ({ size = 24, hasEntry = false, mood = null }) => {
    if (!hasEntry) {
      return (
        <View style={[homeStyles['logo-container'], {
          width: size,
          height: size,
        }]}>
          <Image
            source={require('../assets/blanklogo.png')}
            style={[homeStyles['logo-image'], {
              width: size,
              height: size,
            }]}
            resizeMode="contain"
          />
        </View>
      );
    }

    const gradientColors = getMoodGradient(mood);

    return (
      <View style={[homeStyles['logo-container'], {
        width: size,
        height: size,
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
      }]}>
        {/* 1. 그라데이션이 적용된 로고 배경 */}
        <MaskedView
          style={{
            flex: 1,
            width: size,
            height: size,
          }}
          maskElement={
            <View
              style={{
                backgroundColor: 'transparent',
                width: size,
                height: size,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Image
                source={require('../assets/logo1.png')}
                style={{
                  width: size,
                  height: size,
                }}
                resizeMode="contain"
              />
            </View>
          }
        >
          <LinearGradient
            colors={gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              flex: 1,
              width: size,
              height: size,
            }}
          />
        </MaskedView>

        {/* 2. 눈코입 SVG 오버레이 (모여있는 형태, 기분별 색상) */}
        <View style={{
          position: 'absolute',
          top: size * 0.25,
          left: 0,
          right: 0,
          alignItems: 'center',
        }}>
          <EyesMouthSvg size={size * 0.5} mood={mood} />
        </View>
      </View>
    );
  };

  const calendarDays = generateCalendarDays();

  return (
    <SafeAreaView style={homeStyles['home-container']}>
      <ScrollView style={homeStyles['home-scroll']} showsVerticalScrollIndicator={false}>
        {/* 헤더 */}
        <View style={homeStyles['home-header']}>
          <View style={homeStyles['header-title-container']}>
            <TouchableOpacity onPress={goToPreviousMonth} style={homeStyles['nav-arrow']}>
              <Text style={homeStyles['arrow-text']}>‹</Text>
            </TouchableOpacity>

            <TouchableOpacity style={homeStyles['month-title-wrapper']}>
              <Text style={homeStyles['header-title']}>{getMonthYear(currentDate)}</Text>
              <Text style={homeStyles['dropdown-arrow']}>▼</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={goToNextMonth} style={homeStyles['nav-arrow']}>
              <Text style={homeStyles['arrow-text']}>›</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 캘린더 컨테이너 */}
        <View style={homeStyles['calendar-wrapper']}>
          {/* 캘린더 박스 (둥근 테두리 적용) */}
          <View style={homeStyles['calendar-container']}>
            {/* 요일 헤더 */}
            <View style={homeStyles['weekdays-container']}>
              {['일', '월', '화', '수', '목', '금', '토'].map((day, index) => (
                <View key={index} style={homeStyles['weekday']}>
                  <Text style={[
                    homeStyles['weekday-text'],
                    index === 0 && homeStyles['sunday-text'],
                    index === 6 && homeStyles['saturday-text']
                  ]}>{day}</Text>
                </View>
              ))}
            </View>

            {/* 요일과 날짜 사이 구분선 */}
            <View style={homeStyles['weekdays-separator']} />

            {/* 달력 그리드 */}
            <View style={homeStyles['calendar-grid']}>
              {calendarDays.map((day, index) => {
                if (!day) {
                  return <View key={index} style={homeStyles['empty-day']} />;
                }

                const year = currentDate.getFullYear();
                const month = currentDate.getMonth() + 1;
                const dateKey = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const dayData = diaryData[dateKey];
                const hasEntry = dayData && dayData.hasEntry === true;
                const mood = dayData ? dayData.mood : null;
                const isToday = dateKey === todayString;
                const isSelected = dateKey === selectedDate;

                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      homeStyles['calendar-day'],
                      isSelected && homeStyles['selected-day']
                    ]}
                    onPress={() => handleDatePress(dateKey, dayData)}
                    activeOpacity={0.7}
                  >


                    {/* 날짜 영역 (하단) */}
                    <View style={[
                      homeStyles['date-container'],
                      isToday && homeStyles['today-date-background']
                    ]}>
                      <Text style={[
                        homeStyles['day-number'],
                        isToday && homeStyles['today-text'],
                        isSelected && !isToday && homeStyles['selected-text']
                      ]}>
                        {day}
                      </Text>
                    </View>

                    {/* 로고 영역 (상단) */}
                    <View style={homeStyles['logo-position']}>
                      <LogoIcon size={35} hasEntry={hasEntry} mood={mood} />
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;