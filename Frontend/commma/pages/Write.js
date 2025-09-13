import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { writeStyles } from '../styles/WriteStyles';
import CustomAlert from '../components/CustomAlert';
import { useCustomAlert } from '../hooks/useCustomAlert';
import { API_BASE_URL, getAuthToken, getAuthHeaders } from '../api/config';

const Write = ({ navigation }) => {
    const [diaries, setDiaries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentMonth, setCurrentMonth] = useState(() => {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    });
    const { alertConfig, showAlert, hideAlert } = useCustomAlert();

    const loadDiaries = useCallback(async () => {
        try {
            setLoading(true);
            const token = await getAuthToken();
            if (!token) {
                throw new Error('인증 토큰이 없습니다.');
            }

            const response = await fetch(`${API_BASE_URL}/me/diary?yearMonth=${currentMonth}`, {
                method: 'GET',
                headers: getAuthHeaders(token),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const diariesData = await response.json();

            // 백엔드 데이터를 로컬 형식으로 변환
            const convertedDiaries = diariesData.map(diary => ({
                id: diary.id,
                title: diary.title,
                content: diary.content,
                entryDate: diary.entryDate,
                createdAt: diary.createdAt,
                updatedAt: diary.updatedAt,
                emotionSegments: diary.annotation
                    ? diary.annotation.highlights.map(highlight => ({
                        id: `${highlight.start}-${highlight.end}-${highlight.emotion.id}`,
                        text: diary.content.slice(highlight.start, highlight.end),
                        start: highlight.start,
                        end: highlight.end,
                        emotionId: highlight.emotion.id,
                        emotionName: highlight.emotion.name,
                        emotionColor: `#${highlight.emotion.rgb.toString(16).padStart(6, '0')}`,
                    })) : [],
                annotation: diary.annotation || [],
                topEmotion: diary.topEmotion ? {
                    id: diary.topEmotion.id,
                    name: diary.topEmotion.name,
                    rgb: diary.topEmotion.rgb,
                    color: `#${diary.topEmotion.rgb.toString(16).padStart(6, '0')}`,
                    description: diary.topEmotion.description || ''
                } : null
            }));

            setDiaries(convertedDiaries.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        } catch (error) {
            showAlert({
                title: '오류',
                message: '일기를 불러오는 중 문제가 발생했습니다.',
                type: 'error',
                buttons: [{ text: '확인', onPress: hideAlert }]
            });
        } finally {
            setLoading(false);
        }
    }, [currentMonth]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            loadDiaries();
        });

        return unsubscribe;
    }, [navigation, loadDiaries]);

    useEffect(() => {
        loadDiaries();
    }, [currentMonth, loadDiaries]);

    // 월 변경 함수
    const changeMonth = (direction) => {
        const [year, month] = currentMonth.split('-').map(Number);
        const currentDate = new Date(year, month - 1);

        if (direction === 'prev') {
            currentDate.setMonth(currentDate.getMonth() - 1);
        } else {
            currentDate.setMonth(currentDate.getMonth() + 1);
        }

        const newYear = currentDate.getFullYear();
        const newMonth = String(currentDate.getMonth() + 1).padStart(2, '0');
        setCurrentMonth(`${newYear}-${newMonth}`);
    };

    // 일기 삭제
    const deleteDiary = async (diaryId) => {
        showAlert({
            title: '일기 삭제',
            message: '정말로 이 일기를 삭제하시겠습니까?',
            type: 'warning',
            buttons: [
                {
                    text: '취소',
                    style: 'cancel',
                    onPress: hideAlert
                },
                {
                    text: '삭제',
                    style: 'destructive',
                    onPress: async () => {
                        hideAlert();
                        try {
                            const token = await getAuthToken();
                            if (!token) {
                                throw new Error('인증 토큰이 없습니다.');
                            }

                            const response = await fetch(`${API_BASE_URL}/me/diary/${diaryId}`, {
                                method: 'DELETE',
                                headers: getAuthHeaders(token),
                            });

                            if (!response.ok) {
                                throw new Error(`HTTP error! status: ${response.status}`);
                            }

                            // 로컬 상태에서 삭제
                            setDiaries(prev => prev.filter(diary => diary.id !== diaryId));

                            showAlert({
                                title: '삭제 완료',
                                message: '일기가 성공적으로 삭제되었습니다.',
                                type: 'success',
                                buttons: [{ text: '확인', onPress: hideAlert }]
                            });
                        } catch (error) {
                            showAlert({
                                title: '오류',
                                message: '일기 삭제 중 문제가 발생했습니다.',
                                type: 'error',
                                buttons: [{ text: '확인', onPress: hideAlert }]
                            });
                        }
                    }
                }
            ]
        });
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

    // 월 표시 포맷팅
    const formatMonth = (yearMonth) => {
        const [year, month] = yearMonth.split('-');
        return `${year}년 ${parseInt(month)}월`;
    };

    // 감정 개수 계산
    const getEmotionCount = (emotionSegments) => {
        return emotionSegments ? emotionSegments.length : 0;
    };

    // 일기 미리보기 텍스트
    const getPreviewText = (content) => {
        return content.length > 50 ? content.substring(0, 50) + '...' : content;
    };

    // topEmotion 색상 변환 함수
    const getTopEmotionColor = (topEmotion) => {
        if (!topEmotion || typeof topEmotion.rgb !== 'number') {
            return '#CCCCCC';
        }
        
        const hexColor = `#${topEmotion.rgb.toString(16).padStart(6, '0')}`;
        return hexColor;
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
                    onPress={() => navigation.navigate('EmotionSelector', {
                        diary: {},
                        isEditing: false
                    })}
                >
                    <Icon name="add" size={24} color="#FFFFFF" />
                </TouchableOpacity>
            </View>

            {/* 월 선택 헤더 */}
            <View style={writeStyles.monthSelector}>
                <TouchableOpacity onPress={() => changeMonth('prev')}>
                    <Icon name="chevron-left" size={28} color="#333333" />
                </TouchableOpacity>
                <Text style={writeStyles.monthText}>{formatMonth(currentMonth)}</Text>
                <TouchableOpacity onPress={() => changeMonth('next')}>
                    <Icon name="chevron-right" size={28} color="#333333" />
                </TouchableOpacity>
            </View>

            {/* 일기 목록 */}
            <ScrollView style={writeStyles.diaryList} showsVerticalScrollIndicator={false}>
                {diaries.length === 0 ? (
                    <View style={writeStyles.emptyContainer}>
                        <Icon name="book" size={80} color="#E0E0E0" />
                        <Text style={writeStyles.emptyTitle}>
                            {formatMonth(currentMonth)}에 작성된 일기가 없어요
                        </Text>
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
                                    {/* topEmotion 표시 (수정됨 - 로깅 추가) */}
                                    {diary.topEmotion && (
                                        <View style={[
                                            writeStyles.topEmotionBadge,
                                            { backgroundColor: getTopEmotionColor(diary.topEmotion) }
                                        ]}>
                                            <Text style={writeStyles.topEmotionText}>
                                                {diary.topEmotion.name}
                                            </Text>
                                        </View>
                                    )}

                                    {getEmotionCount(diary.emotionSegments) > 0 && (
                                        <View style={writeStyles.emotionBadge}>
                                            <Icon name="sentiment-satisfied" size={12} color="#FFFFFF" />
                                            <Text style={writeStyles.emotionBadgeText}>
                                                {getEmotionCount(diary.emotionSegments)}
                                            </Text>
                                        </View>
                                    )}

                                    <TouchableOpacity
                                        onPress={() => navigation.navigate('EmotionSelector', {
                                            diary: diary,
                                            isEditing: true
                                        })}
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

            <CustomAlert
                visible={alertConfig.visible}
                title={alertConfig.title}
                message={alertConfig.message}
                buttons={alertConfig.buttons}
                type={alertConfig.type}
                onBackdropPress={hideAlert}
            />
        </SafeAreaView>
    );
};

export default Write;
