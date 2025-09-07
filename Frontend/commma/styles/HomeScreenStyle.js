import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const homeStyles = StyleSheet.create({
  'home-container': {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingBottom: 100,
    paddingHorizontal: 25,
  },
  'home-scroll': {
    flex: 1,
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
    fontSize: 20,
    fontWeight: '600',
    color: '#333333',
  },
  'month-title-wrapper': {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 0,
    justifyContent: 'center',
  },
  'header-title': {
    fontSize: 35,
    fontFamily: '온글잎 의연체',
    fontWeight: '600',
    color: '#333333',
    marginRight: 8,
  },
  'dropdown-arrow': {
    fontSize: 14,
    color: '#999999',
    marginTop: 2,
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
    marginBottom: 15,
    paddingHorizontal: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  'weekday': {
    width: (width - 50) / 7,
    alignItems: 'center',
    paddingVertical: 6,
  },
  'weekday-text': {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  'empty-day': {
    width: (width - 50) / 7,
    height: 70,
  },
  'calendar-day': {
    width: (width - 50) / 7,
    height: 70,
    marginTop: 15,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  'selected-day': {
    backgroundColor: 'transparent',
  },
  'logo-position': {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    marginBottom: 6,
    paddingTop: 3,
  },
  'logo-placeholder': {
    width: 22,
    height: 22,
    borderRadius: 11,
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
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 28,
    minHeight: 28,
  },
  'today-date-background': {
    backgroundColor: '#FF6B6B',
    borderRadius: 8,
    paddingHorizontal: 13,
    paddingVertical: 3,
  },
  'day-number': {
    fontSize: 12,
    color: '#333333',
    fontWeight: '400',
    textAlign: 'center',
  },
  'today-text': {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  'selected-text': {
    color: '#FF6B6B',
    fontWeight: '600',
  },
});

export default homeStyles;