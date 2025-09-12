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

    // 스타일된 텍스트 렌더링 (AI 코멘트 아이콘 포함)
    const renderStyledText = () => {
        if (!diary.content || diary.content.length === 0) {
            return null;
        }

        const emotionSegments = diary.emotionSegments || [];
        const aiComments = diary.annotations && diary.annotations.length > 0
            ? diary.annotations[0].comments || []
            : [];

        if (emotionSegments.length === 0 && aiComments.length === 0) {
            return (
                <Text style={diaryDetailStyles.contentText}>
                    {diary.content}
                </Text>
            );
        }

        const charEmotions = new Array(diary.content.length).fill(null);
        const charComments = new Array(diary.content.length).fill(null);

        // 감정 세그먼트 매핑
        emotionSegments.forEach(segment => {
            for (let i = segment.start; i < segment.end; i++) {
                if (i < diary.content.length) {
                    charEmotions[i] = segment;
                }
            }
        });

        // AI 코멘트 매핑
        aiComments.forEach(comment => {
            for (let i = comment.start; i < comment.end; i++) {
                if (i < diary.content.length) {
                    charComments[i] = comment;
                }
            }
        });

        const elements = [];
        let currentIndex = 0;

        while (currentIndex < diary.content.length) {
            const currentEmotion = charEmotions[currentIndex];
            const currentComment = charComments[currentIndex];
            let endIndex = currentIndex;

            // 같은 스타일의 범위 찾기
            while (endIndex < diary.content.length &&
                charEmotions[endIndex] === currentEmotion &&
                charComments[endIndex] === currentComment) {
                endIndex++;
            }

            const textSegment = diary.content.slice(currentIndex, endIndex);
            const isEmotion = currentEmotion !== null;
            const hasComment = currentComment !== null;

            // Text 컴포넌트만 사용하여 인라인 플로우 유지
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

            // AI 코멘트 아이콘을 별도로 추가
            if (hasComment) {
                elements.push(
                    <Text key={`comment-icon-${currentIndex}`} style={diaryDetailStyles.contentText}>
                        {' '}
                    </Text>
                );
                elements.push(
                    <TouchableOpacity
                        key={`comment-${currentIndex}`}
                        onPress={() => openCommentModal(currentComment)}
                        style={{ alignSelf: 'flex-end', marginLeft: 2 }}
                    >
                        <Icon name="chat-bubble" size={14} color="#FB644C" />
                    </TouchableOpacity>
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
                            <Text style={diaryDetailStyles.commentModalTitle}>AI 코멘트</Text>
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
                                    <Text style={diaryDetailStyles.commentLabel}>AI 코멘트:</Text>
                                    <Text style={diaryDetailStyles.commentText}>
                                        {selectedComment.content}
                                    </Text>
                                    <Text style={diaryDetailStyles.commentAuthor}>
                                        - {selectedComment.author}
                                    </Text>
                                </View>
                            </View>
                        )}

                        <TouchableOpacity
                            style={diaryDetailStyles.commentModalButton}
                            onPress={() => setCommentModalVisible(false)}
                        >
                            <Text style={diaryDetailStyles.commentModalButtonText}>확인</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

export default DiaryDetail;
