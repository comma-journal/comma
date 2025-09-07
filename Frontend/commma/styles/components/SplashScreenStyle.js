import { StyleSheet } from 'react-native';
import customFont from '../fonts';

const splashStyles = StyleSheet.create({
  'splash-container': {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  'splash-content': {
    justifyContent: 'center',
    alignItems: 'center',
  },
  'splash-logo-container': {
    marginBottom: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  'splash-logo-image': {
    width: 120,
    height: 120,
  },
  'splash-app-name': {
    fontSize: 48,
    fontWeight: '100',
    color: '#2C2C2C',
    textAlign: 'center',
    letterSpacing: 4,
    fontFamily: customFont,
  },
});

export default splashStyles;