// hooks/useEmotionsData.js
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://comma.gamja.cloud/v1';

export const useEmotionsData = () => {
    const [emotions, setEmotions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEmotions = async () => {
            try {
                setIsLoading(true);
                
                // AsyncStorage에서 토큰 가져오기
                const savedLoginData = await AsyncStorage.getItem('autoLoginData');
                
                if (!savedLoginData) {
                    throw new Error('로그인 정보가 없습니다.');
                }
                
                const loginData = JSON.parse(savedLoginData);
                const token = loginData.token;
                
                if (!token) {
                    throw new Error('토큰이 없습니다.');
                }
                
                const response = await fetch(`${API_BASE_URL}/emotions`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${token}`, // 토큰을 헤더에 추가
                    },
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                
                // API 응답을 기존 구조에 맞게 변환
                const transformedEmotions = data.map(emotion => ({
                    id: emotion.id.toString(),
                    name: emotion.name,
                    color: `#${emotion.rgb.toString(16).padStart(6, '0').toUpperCase()}` // rgb 숫자를 hex 색상으로 변환
                }));
                
                setEmotions(transformedEmotions);
                setError(null);
            } catch (err) {
                console.error('감정 데이터 로딩 실패:', err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchEmotions();
    }, []);

    return { emotions, isLoading, error };
};
