// hooks/useEmotionsData.js
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EMOTIONS_API_BASE_URL = 'http://comma.gamja.cloud/v2';

export const useEmotionsData = () => {
    const [emotions, setEmotions] = useState([]);
    const [emotionCategories, setEmotionCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEmotions = async () => {
            try {
                setIsLoading(true);
                
                const savedLoginData = await AsyncStorage.getItem('autoLoginData');
                
                if (!savedLoginData) {
                    throw new Error('로그인 정보가 없습니다.');
                }
                
                const loginData = JSON.parse(savedLoginData);
                const token = loginData.token;
                
                if (!token) {
                    throw new Error('토큰이 없습니다.');
                }
                
                // v2 감정 API 호출
                const response = await fetch(`${EMOTIONS_API_BASE_URL}/emotions`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                
                // 감정 데이터 변환
                const transformedEmotions = data.map(emotion => ({
                    id: emotion.id.toString(),
                    name: emotion.name,
                    color: `#${emotion.rgb.toString(16).padStart(6, '0').toUpperCase()}`,
                    category: emotion.category
                }));

                const categories = [
                    {
                        id: 'high_energy_high_pleasantness',
                        name: '활기찬',
                        color: '#FFD54F',
                        description: '에너지가 높고 긍정적인',
                        emotions: transformedEmotions.filter(e => e.category === 'High Energy, High Pleasantness')
                    },
                    {
                        id: 'high_energy_low_pleasantness', 
                        name: '격렬한',
                        color: '#FF8A65',
                        description: '에너지가 높고 부정적인',
                        emotions: transformedEmotions.filter(e => e.category === 'High Energy, Low Pleasantness')
                    },
                    {
                        id: 'low_energy_high_pleasantness',
                        name: '평온한', 
                        color: '#81C784',
                        description: '에너지가 낮고 긍정적인',
                        emotions: transformedEmotions.filter(e => e.category === 'Low Energy, High Pleasantness')
                    },
                    {
                        id: 'low_energy_low_pleasantness',
                        name: '침울한',
                        color: '#64B5F6',
                        description: '에너지가 낮고 부정적인', 
                        emotions: transformedEmotions.filter(e => e.category === 'Low Energy, Low Pleasantness')
                    }
                ];
                
                setEmotions(transformedEmotions);
                setEmotionCategories(categories);
                setError(null);
                
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchEmotions();
    }, []);

    return { emotions, emotionCategories, isLoading, error };
};
