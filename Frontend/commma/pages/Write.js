// Write.js
import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { writeStyles } from '../styles/WriteStyles';

const Write = ({ navigation }) => {
    const [diaries, setDiaries] = useState([]);
    const [loading, setLoading] = useState(true);

    // 일기 목록 로드
    const loadDiaries = useCallback(async () => {
        try {
            const storedDiaries = await AsyncStorage.getItem('diaries');
            if (storedDiaries) {
                const parsedDiaries = JSON.parse(storedDiaries);
                setDiaries(parsedDiaries.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
            }
        } catch (error) {
            console.error('일기 로드 오류:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            loadDiaries();
        });
        
        return unsubscribe;
    }, [navigation, loadDiaries]);

    // 일기 삭제
    const deleteDiary = async (diaryId) => {
        Alert.alert(
            '일기 삭제',
            '정말로 이 일기를 삭제하시겠습니까?',
            [
                { text: '취소', style: 'cancel' },
                {
                    text: '삭제',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const updatedDiaries = diaries.filter(diary => diary.id !== diaryId);
                            await AsyncStorage.setItem('diaries', JSON.stringify(updatedDiaries));
                            setDiaries(updatedDiaries);
                        } catch (error) {
                            console.error('일기 삭제 오류:', error);
                        }
                    }
                }
            ]
        );
    };

    // 날짜 포맷팅
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const weekdays = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
        const weekday = weekdays[date.getDay()];
        return `${month}월 ${day}일 ${weekday}`;
    };

    // 감정 개수 계산
    const getEmotionCount = (emotionSegments) => {
        return emotionSegments ? emotionSegments.length : 0;
    };

    // 일기 미리보기 텍스트
    const getPreviewText = (content) => {
        return content.length > 50 ? content.substring(0, 50) + '...' : content;
    };

    if (loading) {
        return (
            <SafeAreaView style={writeStyles.container}>
                <View style={writeStyles.loadingContainer}>
                    <Text>로딩중...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={writeStyles.container}>
            {/* 헤더 */}
            <View style={writeStyles.header}>
                <Text style={writeStyles.headerTitle}>내 일기</Text>
                <TouchableOpacity
                    style={writeStyles.writeButton}
                    onPress={() => navigation.navigate('DiaryEditor')}
                >
                    <Icon name="add" size={24} color="#FFFFFF" />
                    <Text style={writeStyles.writeButtonText}>새 일기</Text>
                </TouchableOpacity>
            </View>

            {/* 일기 목록 */}
            <ScrollView style={writeStyles.diaryList} showsVerticalScrollIndicator={false}>
                {diaries.length === 0 ? (
                    <View style={writeStyles.emptyContainer}>
                        <Icon name="book" size={80} color="#E0E0E0" />
                        <Text style={writeStyles.emptyTitle}>아직 작성된 일기가 없어요</Text>
                        <Text style={writeStyles.emptySubtitle}>첫 번째 일기를 작성해보세요!</Text>
                        <TouchableOpacity
                            style={writeStyles.emptyWriteButton}
                            onPress={() => navigation.navigate('DiaryEditor')}
                        >
                            <Text style={writeStyles.emptyWriteButtonText}>일기 쓰기</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    diaries.map((diary) => (
                        <TouchableOpacity
                            key={diary.id}
                            style={writeStyles.diaryItem}
                            onPress={() => navigation.navigate('DiaryDetail', { diary })}
                        >
                            <View style={writeStyles.diaryItemHeader}>
                                <Text style={writeStyles.diaryDate}>{formatDate(diary.createdAt)}</Text>
                                <View style={writeStyles.diaryActions}>
                                    {getEmotionCount(diary.emotionSegments) > 0 && (
                                        <View style={writeStyles.emotionBadge}>
                                            <Icon name="sentiment-satisfied" size={12} color="#FFFFFF" />
                                            <Text style={writeStyles.emotionBadgeText}>
                                                {getEmotionCount(diary.emotionSegments)}
                                            </Text>
                                        </View>
                                    )}
                                    <TouchableOpacity
                                        onPress={() => navigation.navigate('DiaryEditor', { diary })}
                                        style={writeStyles.actionButton}
                                    >
                                        <Icon name="edit" size={18} color="#666666" />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => deleteDiary(diary.id)}
                                        style={writeStyles.actionButton}
                                    >
                                        <Icon name="delete" size={18} color="#FF6B6B" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            
                            <Text style={writeStyles.diaryTitle} numberOfLines={1}>
                                {diary.title || '제목 없음'}
                            </Text>
                            
                            <Text style={writeStyles.diaryPreview} numberOfLines={3}>
                                {getPreviewText(diary.content)}
                            </Text>
                        </TouchableOpacity>
                    ))
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

export default Write;
