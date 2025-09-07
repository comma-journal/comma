// src/styles/fonts.js
import { Platform } from 'react-native';

const customFont = Platform.select({
    ios: '온글잎 의연체',
    android: 'OwnglyphEuiyeonChae-R',
});

export default customFont;
