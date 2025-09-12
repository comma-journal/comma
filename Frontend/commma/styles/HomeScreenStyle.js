import { StyleSheet, Dimensions } from 'react-native';
import customFont from './fonts';

const { width, height } = Dimensions.get('window');

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
  // 메인 컨테이너
  'home-container': {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingBottom: 100,
  },


'app-header': {
  backgroundColor: '#FFFFFF',
  paddingHorizontal: horizontalPadding,
  paddingTop: 12,
  paddingBottom: 18,

  // 은은한 구분선 (살짝 보이는 선)
  borderBottomWidth: 0.2,
  borderBottomColor: 'rgba(0,0,0,0.08)',

},


'app-header-container': {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
},

'app-logo-section': {
  flexDirection: 'row',
  alignItems: 'center',
  flex: 1,
  zIndex: 1, // 그림자 위에 컨텐츠가 올라오도록
},

'app-logo': {
  width: 32,
  height: 32,
  marginRight: 12,
},

'app-title': {
  fontSize: width < 350 ? 20 : width < 400 ? 22 : 24,
  fontFamily: customFont,
  color: '#2D2D2D',
  letterSpacing: -0.5,
},

  // 홈 스크롤 뷰
  'home-scroll': {
    flex: 1,
    paddingHorizontal: horizontalPadding,
  },

  // 캘린더 헤더
  'home-header': {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 0,
    paddingTop: 20,
    paddingBottom: 25,
    backgroundColor: '#FFFFFF',
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
    borderRadius: 12,
  },
  'arrow-text': {
    fontSize: 22,
    fontFamily: customFont,
    color: '#333333',
  },
  'month-title-wrapper': {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    justifyContent: 'center',
  },
  'header-title': {
    fontSize: width < 350 ? 28 : 32,
    color: '#333333',
    marginRight: 8,
    fontFamily: customFont,
  },
  'dropdown-arrow': {
    fontSize: 14,
    color: '#FB644C',
    marginTop: 2,
    fontFamily: customFont,
  },

  // 연월 선택 모달 스타일
  'modal-backdrop': {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  'modal-container': {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    width: '100%',
    maxWidth: 400,
    maxHeight: height * 0.7,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  'modal-header': {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  'modal-title': {
    fontSize: 20,
    fontFamily: customFont,
    color: '#333333',
  },
  'modal-close-button': {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  'modal-close-text': {
    fontSize: 20,
    color: '#666666',
    fontWeight: '600',
  },
  'modal-content': {
    flex: 1,
    paddingHorizontal: 20,
  },
  'year-section': {
    marginVertical: 15,
  },
  'year-title': {
    fontSize: 18,
    fontFamily: customFont,
    color: '#333333',
    marginBottom: 12,
    paddingLeft: 4,
  },
  'months-grid': {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  'month-button': {
    width: '30%',
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginBottom: 10,
    borderRadius: 12,
    backgroundColor: '#F8F9FA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  'month-button-selected': {

    shadowColor: '#FB644C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  'month-text': {
    fontSize: 14,
    fontFamily: customFont,
    color: '#666666',
  },
  'month-text-selected': {
    color: '#FFFFFF',
    fontWeight: '600',
  },

  // 캘린더 관련 스타일
  'calendar-wrapper': {
    paddingHorizontal: 0,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  'calendar-container': {
    width: '100%',
  },
  'weekdays-container': {
    flexDirection: 'row',
    marginBottom: width < 350 ? 10 : 15,
    paddingHorizontal: 0,
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: calendarWidth,

  },
  'weekday': {
    width: dayWidth,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  'weekday-text': {
    fontSize: width < 350 ? 18 : 20,
    color: '#666666',
    textAlign: 'center',
    fontFamily: customFont,
  },
  'sunday-text': {
    color: '#FF6B6B',
  },
  'saturday-text': {
    color: '#4DABF7',
  },
  'weekdays-separator': {
    height: 1,
    backgroundColor: '#E0E0E0',
    width: '100%',
  },
  'calendar-grid': {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: calendarWidth,
  },
  'empty-day': {
    width: dayWidth,
    height: dayHeight,
  },
  'calendar-day': {
    width: dayWidth,
    height: dayHeight,
    marginTop: gridMarginTop,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: width < 350 ? 4 : 6,
    paddingHorizontal: 2,
  },
  'selected-day': {
    backgroundColor: 'transparent',
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

    color: '#333333',
    textAlign: 'center',
    fontWeight: '500',
  },
  'today-text': {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  'selected-text': {
    color: '#FB644C',
    fontWeight: '600',
  },

  // 로고 관련 스타일
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

});

export default homeStyles;