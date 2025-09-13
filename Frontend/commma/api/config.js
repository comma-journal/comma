// api/config.js
import AsyncStorage from '@react-native-async-storage/async-storage';

export const API_BASE_URL = 'http://comma.gamja.cloud/v1';

// 토큰 가져오기 유틸리티
export const getAuthToken = async () => {
    try {
        const savedLoginData = await AsyncStorage.getItem('autoLoginData');
        
        if (!savedLoginData) {
            throw new Error('로그인 정보가 없습니다.');
        }
        
        const loginData = JSON.parse(savedLoginData);
        const token = loginData.token;
        
        if (!token) {
            throw new Error('토큰이 없습니다.');
        }
        
        return token;
    } catch (error) {
        console.error('토큰 가져오기 실패:', error);
        throw error;
    }
};

// API 호출 공통 헤더
export const getAuthHeaders = (token) => ({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Bearer ${token}`,
});
