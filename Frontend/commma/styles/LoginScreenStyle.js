import { StyleSheet } from 'react-native';
import customFont from './fonts';

const loginStyles = StyleSheet.create({
  'login-container': {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  'login-scroll-container': {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingVertical: 50,
  },
  'login-header-section': {
    alignItems: 'center',
    marginBottom: 40,
  },
  'login-logo-container': {
    marginBottom: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  'login-logo-image': {
    width: 120,
    height: 120,
  },
  'login-greeting-text': {
    fontSize: 32,
    color: '#333333',
    textAlign: 'center',
    fontWeight: '400',
    fontFamily: customFont,
  },
  'login-form-container': {
    width: '100%',
  },
  'login-input': {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 15,
    fontSize: 16,
    color: '#333333',
    marginBottom: 15,
  },
  'login-signup-button': {
    backgroundColor: '#E8E8E8',
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  'login-signup-button-active': {
    backgroundColor: '#FF644C',
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  'login-signup-button-text': {
    color: '#666666',
    fontSize: 16,
    fontWeight: '500',
  },
  'login-signup-button-text-active': {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  'login-help-text': {
    color: '#999999',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default loginStyles;