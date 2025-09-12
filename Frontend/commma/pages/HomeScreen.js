import React, { useState, useEffect } from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import homeStyles from '../styles/HomeScreenStyle';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [selectedDate, setSelectedDate] = useState('');
  const [currentDate, setCurrentDate] = useState(new Date(2025, 8, 1));
  const [diaryData, setDiaryData] = useState({});

  // API에서 일기 데이터 가져오기
  const fetchDiaryData = async (yearMonth) => {
    console.log(`${yearMonth} 데이터 로드 요청`);
    
    try {
      const API_BASE_URL = 'https://comma.gamja.cloud';
      
      const savedLoginData = await AsyncStorage.getItem('autoLoginData');
      let token = null;
      
      if (savedLoginData) {
        const loginData = JSON.parse(savedLoginData);
        token = loginData.token;
        console.log('토큰 발견:', token ? '있음' : '없음');
      }
      
      const headers = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`${API_BASE_URL}/v1/me/diary?yearMonth=${yearMonth}`, {
        method: 'GET',
        headers: headers,
      });
      
      console.log('API 응답 상태:', response.status);
      
      if (!response.ok) {
        if (response.status === 401) {
          console.error('인증 실패 - 토큰을 확인하세요');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const diaries = await response.json();
      console.log('API 응답:', diaries);
      
      if (!Array.isArray(diaries)) {
        console.warn('API 응답이 배열이 아닙니다:', diaries);
        throw new Error('Invalid API response format');
      }
      
      const formattedData = {};
      diaries.forEach(diary => {
        const date = diary.entryDate;
        
        let mood = 'happy';
        if (diary.topEmotion && diary.topEmotion.name) {
          const emotionMapping = {
            '열정': 'excited', '흥분': 'excited', '활기': 'excited',
            '기쁨': 'happy', '환희': 'happy', '희망': 'happy', '만족': 'happy', '행복': 'happy',
            '사랑': 'love', '애정': 'love', '로맨스': 'love',
            '분노': 'angry', '격분': 'angry', '화남': 'angry', '짜증': 'angry',
            '경멸': 'angry', '혐오': 'angry', '불만': 'angry',
            '실망': 'sad', '우울': 'sad', '무력감': 'sad', '슬픔': 'sad',
            '침울': 'sad', '절망': 'sad', '공허': 'sad', '외로움': 'sad', '고독': 'sad',
            '안정': 'calm', '성장': 'calm', '평화': 'calm', '조화': 'calm',
            '신뢰': 'calm', '균형': 'calm', '냉정': 'calm', '평온': 'calm',
            '고요': 'calm', '집중': 'calm', '사색': 'calm', '깊이': 'calm',
            '불안': 'worried', '의심': 'worried', '두려움': 'worried', '공포': 'worried',
            '경악': 'worried', '혼란': 'worried', '당황': 'worried', '충격': 'worried',
            '피로': 'tired', '지루함': 'tired', '무관심': 'tired',
            '신비': 'calm', '영감': 'excited'
          };
          mood = emotionMapping[diary.topEmotion.name] || 'happy';
        }
        
        formattedData[date] = {
          hasEntry: true,
          topEmotion: diary.topEmotion,
          rgb: diary.topEmotion?.rgb || 0,
          mood: mood,
          title: diary.title,
          content: diary.content,
          id: diary.id,
          createdAt: diary.createdAt,
          updatedAt: diary.updatedAt
        };
      });
      
      console.log('변환된 데이터:', formattedData);
      setDiaryData(formattedData);
      
    } catch (error) {
      console.error('일기 데이터 로딩 실패:', error);
      
      if (__DEV__) {
        setDiaryData({
          '2025-09-02': { hasEntry: true, mood: 'happy', rgb: 0xFFB700 },
          '2025-09-03': { hasEntry: true, mood: 'sad', rgb: 0x57606F },
          '2025-09-06': { hasEntry: true, mood: 'angry', rgb: 0xEE5A52 },
          '2025-09-15': { hasEntry: true, mood: 'happy', rgb: 0xFFB700 },
          '2025-09-16': { hasEntry: true, mood: 'excited', rgb: 0xFF6B35 },
          '2025-09-17': { hasEntry: true, mood: 'calm', rgb: 0x5352ED },
          '2025-09-18': { hasEntry: true, mood: 'worried', rgb: 0xA53860 },
          '2025-09-19': { hasEntry: true, mood: 'happy', rgb: 0xFFB700 },
          '2025-09-21': { hasEntry: true, mood: 'sad', rgb: 0x57606F },
          '2025-09-22': { hasEntry: true, mood: 'excited', rgb: 0xFF6B35 },
          '2025-09-23': { hasEntry: true, mood: 'calm', rgb: 0x5352ED },
          '2025-09-24': { hasEntry: true, mood: 'angry', rgb: 0xEE5A52 },
          '2025-09-25': { hasEntry: true, mood: 'happy', rgb: 0xFFB700 },
          '2025-09-26': { hasEntry: true, mood: 'worried', rgb: 0xA53860 },
          '2025-09-29': { hasEntry: true, mood: 'excited', rgb: 0xFF6B35 },
        });
      } else {
        setDiaryData({});
      }
    }
  };

  useEffect(() => {
    let isMounted = true;
    
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const yearMonth = `${year}-${month}`;
    
    if (isMounted) {
      fetchDiaryData(yearMonth);
    }
    
    return () => {
      isMounted = false;
    };
  }, [currentDate]);

  const rgbToHex = (rgb) => {
    if (!rgb) return '#CCCCCC';
    const hex = rgb.toString(16).padStart(6, '0');
    return `#${hex}`;
  };

  const getRgbGradient = (rgb) => {
    if (!rgb) return ['#F0F0F0', '#E0E0E0', '#CCCCCC'];
    
    const baseColor = rgbToHex(rgb);
    
    const lightenColor = (hex, percent) => {
      const num = parseInt(hex.replace("#", ""), 16);
      const amt = Math.round(2.55 * percent);
      const R = (num >> 16) + amt;
      const G = (num >> 8 & 0x00FF) + amt;
      const B = (num & 0x0000FF) + amt;
      return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
        (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
        (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
    };

    const darkenColor = (hex, percent) => {
      const num = parseInt(hex.replace("#", ""), 16);
      const amt = Math.round(2.55 * percent);
      const R = (num >> 16) - amt;
      const G = (num >> 8 & 0x00FF) - amt;
      const B = (num & 0x0000FF) - amt;
      return "#" + (0x1000000 + (R > 255 ? 255 : R < 0 ? 0 : R) * 0x10000 +
        (G > 255 ? 255 : G < 0 ? 0 : G) * 0x100 +
        (B > 255 ? 255 : B < 0 ? 0 : B)).toString(16).slice(1);
    };

    return [
      lightenColor(baseColor, 30),
      baseColor,
      darkenColor(baseColor, 20)
    ];
  };

  const today = new Date();
  const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const handleDatePress = (dateKey, dayData) => {
    setSelectedDate(dateKey);
    console.log('선택된 날짜:', dateKey, '감정:', dayData?.topEmotion?.name, 'RGB:', dayData?.rgb);
    navigation.navigate('WriteTab', { screen: 'WriteList' });
  };

  const getMonthYear = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    return `${year}년 ${month}월`;
  };

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

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    const days = [];

    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    while (days.length % 7 !== 0) {
      days.push(null);
    }

    return days;
  };

  const getRgbMoodColors = (rgb) => {
    if (!rgb) return { eye: '#6B4200', mouth: '#FBBE25' };
    
    const baseColor = rgbToHex(rgb);
    
    const darkenColor = (hex, percent) => {
      const num = parseInt(hex.replace("#", ""), 16);
      const amt = Math.round(2.55 * percent);
      const R = (num >> 16) - amt;
      const G = (num >> 8 & 0x00FF) - amt;
      const B = (num & 0x0000FF) - amt;
      return "#" + (0x1000000 + (R > 255 ? 255 : R < 0 ? 0 : R) * 0x10000 +
        (G > 255 ? 255 : G < 0 ? 0 : G) * 0x100 +
        (B > 255 ? 255 : B < 0 ? 0 : B)).toString(16).slice(1);
    };

    return {
      eye: darkenColor(baseColor, 40),
      mouth: baseColor
    };
  };

  const getMouthPath = (mood) => {
    const paths = {
      'happy': 'M12 22C18 28, 42 28, 48 22',
      'excited': 'M10 20C18 32, 42 32, 50 20',
      'calm': 'M18 24L42 24',
      'sad': 'M12 26C18 20, 42 20, 48 26',
      'angry': 'M15 26L45 26',
      'worried': 'M15 24C25 22, 35 22, 45 24',
      'love': 'M10 20C18 32, 42 32, 50 20',
      'tired': 'M15 25C25 23, 35 23, 45 25',
    };
    return paths[mood] || 'M12 22C18 28, 42 28, 48 22';
  };

  const getMouthStrokeWidth = (mood) => {
    const widths = {
      'happy': 2,
      'excited': 3,
      'calm': 2,
      'sad': 2,
      'angry': 3,
      'worried': 2,
      'love': 2,
      'tired': 2,
    };
    return widths[mood] || 2;
  };

  const EyesMouthSvg = ({ size = 24, mood = 'happy', rgb }) => {
    const moodColors = getRgbMoodColors(rgb);
    const mouthPath = getMouthPath(mood);
    const strokeWidth = getMouthStrokeWidth(mood);

    const svgXml = `
      <svg width="${size}" height="${size * 0.6}" viewBox="0 0 60 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="18" cy="12" r="3" fill="${moodColors.eye}"/>
        <circle cx="42" cy="12" r="3" fill="${moodColors.eye}"/>
        <path d="${mouthPath}" stroke="#000000" stroke-width="${strokeWidth}" stroke-linecap="round" fill="none"/>
      </svg>
    `;

    return <SvgXml xml={svgXml} width={size} height={size * 0.6} />;
  };

  const LogoIcon = ({ size = 24, hasEntry = false, mood = null, rgb = null }) => {
    if (!hasEntry) {
      return (
        <View style={[homeStyles['logo-container'], { width: size, height: size }]}>
          <Image
            source={require('../assets/blanklogo.png')}
            style={[homeStyles['logo-image'], { width: size, height: size }]}
            resizeMode="contain"
          />
        </View>
      );
    }

    const gradientColors = getRgbGradient(rgb);

    return (
      <View style={[homeStyles['logo-container'], {
        width: size, height: size, position: 'relative',
        justifyContent: 'center', alignItems: 'center',
      }]}>
        <MaskedView
          style={{ flex: 1, width: size, height: size }}
          maskElement={
            <View style={{
              backgroundColor: 'transparent', width: size, height: size,
              justifyContent: 'center', alignItems: 'center',
            }}>
              <Image
                source={require('../assets/logo1.png')}
                style={{ width: size, height: size }}
                resizeMode="contain"
              />
            </View>
          }
        >
          <LinearGradient
            colors={gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ flex: 1, width: size, height: size }}
          />
        </MaskedView>

        <View style={{
          position: 'absolute', top: size * 0.2, left: 0, right: 0, alignItems: 'center'
        }}>
          <EyesMouthSvg size={size * 0.6} mood={mood} rgb={rgb} />
        </View>
      </View>
    );
  };

  const calendarDays = generateCalendarDays();

  return (
    <SafeAreaView style={homeStyles['home-container']}>
      <ScrollView style={homeStyles['home-scroll']} showsVerticalScrollIndicator={false}>
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

        <View style={homeStyles['calendar-wrapper']}>
          <View style={homeStyles['calendar-container']}>
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

            <View style={homeStyles['weekdays-separator']} />

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
                const rgb = dayData ? dayData.rgb : null;
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

                    <View style={homeStyles['logo-position']}>
                      <LogoIcon size={35} hasEntry={hasEntry} mood={mood} rgb={rgb} />
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