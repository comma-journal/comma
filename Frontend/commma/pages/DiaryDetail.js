// DiaryDetail.js
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { diaryDetailStyles } from '../styles/DiaryDetailStyles';
import { API_BASE_URL, getAuthToken, getAuthHeaders } from '../api/config';

const DiaryDetail = ({ navigation, route }) => {
    const { diary: initialDiary } = route.params;
    const [diary, setDiary] = useState(initialDiary);
    const [loading, setLoading] = useState(false);
    const [commentModalVisible, setCommentModalVisible] = useState(false);
    const [selectedComment, setSelectedComment] = useState(null);
    const [completedComments, setCompletedComments] = useState(new Set());

    const handleCompleteComment = (commentStart, commentEnd) => {
        const commentKey = `${commentStart}-${commentEnd}`;
        const newCompleted = new Set(completedComments);
        newCompleted.add(commentKey);
        setCompletedComments(newCompleted);
        setCommentModalVisible(false);
    };

    // 일기 상세 정보 다시 로드 (AI 코멘트 포함)
    useEffect(() => {
        const loadDiaryDetail = async () => {
            try {
                setLoading(true);
                const token = await getAuthToken();
                if (!token) return;

                const response = await fetch(`${API_BASE_URL}/me/diary/${diary.id}`, {
                    method: 'GET',
                    headers: getAuthHeaders(token),
                });

                if (response.ok) {
                    const diaryData = await response.json();

                    // 백엔드 데이터를 로컬 형식으로 변환
                    const convertedDiary = {
                        id: diaryData.id,
                        title: diaryData.title,
                        content: diaryData.content,
                        createdAt: diaryData.createdAt,
                        updatedAt: diaryData.updatedAt,
                        emotionSegments: diaryData.annotation
                            ? diaryData.annotation.highlights.map(highlight => ({
                                id: `${highlight.start}-${highlight.end}-${highlight.emotion.id}`,
                                text: diaryData.content.slice(highlight.start, highlight.end),
                                start: highlight.start,
                                end: highlight.end,
                                emotionId: highlight.emotion.id,
                                emotionName: highlight.emotion.name,
                                emotionColor: `#${highlight.emotion.rgb.toString(16).padStart(6, '0')}`,
                            })) : [],
                        annotation: diaryData.annotation || []
                    };

                    setDiary(convertedDiary);
                }
            } catch (error) {
                console.error('일기 상세 로드 오류:', error);
            } finally {
                setLoading(false);
            }
        };

        loadDiaryDetail();
    }, [diary.id]);

    // 코멘트 완료 여부 확인 함수
    const isCommentCompleted = (start, end) => {
        const commentKey = `${start}-${end}`;
        return completedComments.has(commentKey);
    };

    // 스타일된 텍스트 렌더링 (수정됨 - AI 코멘트 완료 상태 반영)
    const renderStyledText = () => {
        if (!diary.content || diary.content.length === 0) {
            return null;
        }

        const emotionSegments = diary.emotionSegments || [];
        
        // AI 코멘트 기능 완전 제거 - 감정만 표시
        if (emotionSegments.length === 0) {
            return (
                <Text style={diaryDetailStyles.contentText}>
                    {diary.content}
                </Text>
            );
        }

        const charEmotions = new Array(diary.content.length).fill(null);
        
        // 감정 세그먼트 매핑만 수행
        emotionSegments.forEach(segment => {
            for (let i = segment.start; i < segment.end; i++) {
                if (i < diary.content.length) {
                    charEmotions[i] = segment;
                }
            }
        });

        const elements = [];
        let currentIndex = 0;

        while (currentIndex < diary.content.length) {
            const currentEmotion = charEmotions[currentIndex];
            let endIndex = currentIndex;

            // 같은 감정의 범위 찾기
            while (endIndex < diary.content.length && 
                   charEmotions[endIndex] === currentEmotion) {
                endIndex++;
            }

            const textSegment = diary.content.slice(currentIndex, endIndex);
            const isEmotion = currentEmotion !== null;

            if (isEmotion) {
                elements.push(
                    <Text
                        key={`emotion-${currentIndex}`}
                        style={[
                            diaryDetailStyles.contentText,
                            {
                                backgroundColor: currentEmotion.emotionColor + '40',
                                borderRadius: 2,
                            }
                        ]}
                    >
                        {textSegment}
                    </Text>
                );
            } else {
                elements.push(
                    <Text key={`normal-${currentIndex}`} style={diaryDetailStyles.contentText}>
                        {textSegment}
                    </Text>
                );
            }

            currentIndex = endIndex;
        }

        return (
            <Text style={diaryDetailStyles.contentText}>
                {elements}
            </Text>
        );
    };

    // 날짜 포맷팅 함수
    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString);

            // 유효하지 않은 날짜 처리
            if (isNaN(date.getTime())) {
                console.warn('유효하지 않은 날짜:', dateString);
                return '날짜 오류';
            }

            const month = date.getMonth() + 1;
            const day = date.getDate();
            const weekdays = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
            const weekday = weekdays[date.getDay()];

            return `${month}월 ${day}일 ${weekday}`;
        } catch (error) {
            console.error('날짜 포맷팅 오류:', error, dateString);
            return '날짜 오류';
        }
    };

    // AI 코멘트 모달 열기
    const openCommentModal = (comment) => {
        setSelectedComment(comment);
        setCommentModalVisible(true);
    };

    return (
        <SafeAreaView style={diaryDetailStyles.container}>
            {/* 헤더 */}
            <View style={diaryDetailStyles.header}>
                <TouchableOpacity
                    style={diaryDetailStyles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Icon name="arrow-back" size={24} color="#333333" />
                </TouchableOpacity>

                <TouchableOpacity
                    style={diaryDetailStyles.editButton}
                    onPress={() => navigation.navigate('EmotionSelector', {
                        diary: diary,
                        isEditing: true
                    })}
                >
                    <Icon name="edit" size={20} color="#FFFFFF" />
                </TouchableOpacity>
            </View>

            <ScrollView style={diaryDetailStyles.scrollView}>
                {/* 날짜 (간단하게 작성일만 표시) */}
                <View style={diaryDetailStyles.dateContainer}>
                    <Text style={diaryDetailStyles.dateText}>
                        {formatDate(diary.createdAt)}
                    </Text>
                </View>

                {/* 제목 */}
                <View style={diaryDetailStyles.titleContainer}>
                    <Text style={diaryDetailStyles.title}>{diary.title}</Text>
                </View>

                {/* 내용 */}
                <View style={diaryDetailStyles.contentContainer}>
                    {renderStyledText()}
                </View>

                {/* 감정 통계 */}
                {diary.emotionSegments && diary.emotionSegments.length > 0 && (
                    <View style={diaryDetailStyles.emotionStats}>
                        <Text style={diaryDetailStyles.emotionStatsTitle}>
                            선택된 감정 ({diary.emotionSegments.length}개)
                        </Text>

                        {diary.emotionSegments
                            .sort((a, b) => a.start - b.start)
                            .map((segment) => (
                                <View key={segment.id} style={diaryDetailStyles.emotionItem}>
                                    <View style={[
                                        diaryDetailStyles.emotionIndicator,
                                        { backgroundColor: segment.emotionColor }
                                    ]}>
                                        <Text style={diaryDetailStyles.emotionIndicatorText}>
                                            {segment.emotionName}
                                        </Text>
                                    </View>
                                    <Text style={diaryDetailStyles.emotionText}>
                                        "{segment.text}"
                                    </Text>
                                </View>
                            ))
                        }
                    </View>
                )}
            </ScrollView>

            {/* AI 코멘트 모달 */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={commentModalVisible}
                onRequestClose={() => setCommentModalVisible(false)}
            >
                <View style={diaryDetailStyles.commentModalOverlay}>
                    <View style={diaryDetailStyles.commentModalContainer}>
                        <View style={diaryDetailStyles.commentModalHeader}>
                            <Text style={diaryDetailStyles.commentModalTitle}>AI 피드백</Text>
                            <TouchableOpacity onPress={() => setCommentModalVisible(false)}>
                                <Icon name="close" size={24} color="#666666" />
                            </TouchableOpacity>
                        </View>

                        {selectedComment && (
                            <View style={diaryDetailStyles.commentModalContent}>
                                <View style={diaryDetailStyles.commentTargetText}>
                                    <Text style={diaryDetailStyles.commentTargetLabel}>선택된 문장:</Text>
                                    <Text style={diaryDetailStyles.commentTargetContent}>
                                        "{diary.content.slice(selectedComment.start, selectedComment.end)}"
                                    </Text>
                                </View>

                                <View style={diaryDetailStyles.commentContent}>
                                    <Text style={diaryDetailStyles.commentLabel}>AI 질문:</Text>
                                    <Text style={diaryDetailStyles.commentText}>
                                        {selectedComment.content}
                                    </Text>
                                    <Text style={diaryDetailStyles.commentAuthor}>
                                        - {selectedComment.author}
                                    </Text>
                                </View>
                            </View>
                        )}

                        <View style={diaryDetailStyles.commentModalButtons}>
                            <TouchableOpacity
                                style={diaryDetailStyles.commentModalCancelButton}
                                onPress={() => setCommentModalVisible(false)}
                            >
                                <Text style={diaryDetailStyles.commentModalCancelButtonText}>닫기</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={diaryDetailStyles.commentModalCompleteButton}
                                onPress={() => handleCompleteComment(selectedComment?.start, selectedComment?.end)}
                            >
                                <Text style={diaryDetailStyles.commentModalCompleteButtonText}>완료</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

export default DiaryDetail;
