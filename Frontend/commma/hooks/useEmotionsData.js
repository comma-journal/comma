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
                        'Authorization': `Bearer ${token}`,
                    },
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                
                const transformedEmotions = data.map(emotion => ({
                    id: emotion.id.toString(),
                    name: emotion.name,
                    color: `#${emotion.rgb.toString(16).padStart(6, '0').toUpperCase()}`
                }));
                
                setEmotions(transformedEmotions);
                setError(null);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchEmotions();
    }, []);

    return { emotions, isLoading, error };
};
