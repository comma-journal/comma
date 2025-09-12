import { StyleSheet, Dimensions } from 'react-native';
import customFont from './fonts';

const { width } = Dimensions.get('window');

// 화면 크기별 설정값 계산
const getResponsiveValues = () => {
  const screenWidth = width;

  // 화면 크기에 따른 패딩 조정
  const horizontalPadding = screenWidth < 350 ? 15 : screenWidth < 400 ? 20 : 25;

  // 캘린더 영역의 실제 너비
  const calendarWidth = screenWidth - (horizontalPadding * 2);

  // 일자별 너비 (7일로 나누기) - 정확한 계산
  const dayWidth = Math.floor(calendarWidth / 7);

  // 화면 크기에 따른 높이 조정
  const dayHeight = screenWidth < 350 ? 60 : screenWidth < 400 ? 65 : 70;

  // 그리드 간격 조정
  const gridMarginTop = screenWidth < 350 ? 10 : screenWidth < 400 ? 12 : 15;

  return {
    horizontalPadding,
    dayWidth,
    dayHeight,
    gridMarginTop,
    calendarWidth,
  };
};

const { horizontalPadding, dayWidth, dayHeight, gridMarginTop, calendarWidth } = getResponsiveValues();

const homeStyles = StyleSheet.create({
  'home-container': {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingBottom: 100,
    paddingHorizontal: horizontalPadding,
  },
  'home-header': {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 0,
    paddingTop: 15,
    paddingBottom: 25,
  },
  'header-title-container': {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  'nav-arrow': {
    padding: 12,
    marginHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 44,
    minHeight: 44,
  },
  'arrow-text': {
    fontSize: 22,
    fontFamily: customFont,
    color: '#333333',
  },
  'month-title-wrapper': {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 0,
    justifyContent: 'center',
  },
  'header-title': {
    fontSize: width < 350 ? 32 : 37,
    color: '#333333',
    marginRight: 8,
    fontFamily: customFont,
  },
  'dropdown-arrow': {
    fontSize: 16,
    color: '#999999',
    marginTop: 2,
    fontFamily: customFont,
  },
  'settings-button': {
    padding: 8,
  },
  'settings-icon': {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  'gear-tooth': {
    position: 'absolute',
    width: 20,
    height: 3,
    backgroundColor: '#CCCCCC',
    borderRadius: 1.5,
  },
  'gear-center': {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#CCCCCC',
    position: 'absolute',
  },
  'calendar-wrapper': {
    paddingHorizontal: 0,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  'weekdays-container': {
    flexDirection: 'row',
    marginBottom: width < 350 ? 10 : 15,
    paddingHorizontal: 0,
    alignItems: 'center',
    justifyContent: 'flex-start', // 시작점에서 정렬
    width: calendarWidth, // 정확한 너비 지정
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingBottom: 15,
  },
  'weekday': {
    width: dayWidth, // 정확히 같은 너비
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  'weekday-text': {
    fontSize: width < 350 ? 18 : 20,
    color: '#666666',
    textAlign: 'center', // 텍스트 중앙 정렬
    fontFamily: customFont,
  },
  'sunday-text': {
    color: '#FF6B6B',
  },
  'saturday-text': {
    color: '#4DABF7',
  },
  'calendar-grid': {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start', // 시작점에서 정렬
    alignItems: 'flex-start',
    width: calendarWidth, // 정확한 너비 지정
  },
  'empty-day': {
    width: dayWidth, // 정확히 같은 너비
    height: dayHeight,
  },
  'calendar-day': {
    width: dayWidth, // 정확히 같은 너비
    height: dayHeight,
    marginTop: gridMarginTop,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: width < 350 ? 4 : 6,
    // 각 날짜 셀의 중앙 정렬을 위한 추가 스타일
    paddingHorizontal: 2, // 좌우 여백 최소화
  },
  'selected-day': {
    backgroundColor: 'transparent',
  },
  'logo-position': {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    marginBottom: width < 350 ? 4 : 6,
    paddingTop: 3,
  },
  'logo-placeholder': {
    width: width < 350 ? 18 : 22,
    height: width < 350 ? 18 : 22,
    borderRadius: width < 350 ? 9 : 11,
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#E9ECEF',
    borderStyle: 'dashed',
  },
  'logo-container': {
    justifyContent: 'center',
    alignItems: 'center',
  },
  'logo-image': {
    borderRadius: 100,
  },
  'date-container': {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: width < 350 ? 6 : 8,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: width < 350 ? 24 : 28,
    minHeight: width < 350 ? 18 : 20,
    marginBottom: 10,
  },
  'today-date-background': {
    backgroundColor: '#FF6B6B',
    borderRadius: 8,
    paddingHorizontal: width < 350 ? 6 : 8,
    paddingVertical: 1,
  },
  'day-number': {
    fontSize: width < 350 ? 18 : 20,
    color: '#333333',
    fontFamily: customFont,
    textAlign: 'center',
  },
  'today-text': {
    color: '#FFFFFF',
    fontFamily: customFont,
  },
  'selected-text': {
    color: '#FF6B6B',
    fontFamily: customFont,
  },
});

export default homeStyles;