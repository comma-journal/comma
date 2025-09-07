// DiaryDetail.js
import React from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { diaryDetailStyles } from '../styles/DiaryDetailStyles';

const DiaryDetail = ({ navigation, route }) => {
    const { diary } = route.params;

    // 날짜 포맷팅
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const weekdays = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
        const weekday = weekdays[date.getDay()];
        return `${month}월 ${day}일 ${weekday}`;
    };

    // 스타일된 텍스트 렌더링
    const renderStyledText = () => {
        if (!diary.emotionSegments || diary.emotionSegments.length === 0) {
            return (
                <Text style={diaryDetailStyles.contentText}>
                    {diary.content}
                </Text>
            );
        }

        const sortedSegments = [...diary.emotionSegments].sort((a, b) => a.start - b.start);
        const charEmotions = new Array(diary.content.length).fill(null);
        
        sortedSegments.forEach(segment => {
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

            while (endIndex < diary.content.length && charEmotions[endIndex] === currentEmotion) {
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
                    onPress={() => navigation.navigate('DiaryEditor', { diary })}
                >
                    <Icon name="edit" size={20} color="#FFFFFF" />
                    <Text style={diaryDetailStyles.editButtonText}>수정</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={diaryDetailStyles.scrollView}>
                {/* 날짜 */}
                <View style={diaryDetailStyles.dateContainer}>
                    <Text style={diaryDetailStyles.dateText}>
                        {formatDate(diary.createdAt)}
                    </Text>
                    {diary.updatedAt !== diary.createdAt && (
                        <Text style={diaryDetailStyles.updatedText}>
                            (수정됨: {formatDate(diary.updatedAt)})
                        </Text>
                    )}
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
                            감정 분석 ({diary.emotionSegments.length}개)
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
        </SafeAreaView>
    );
};

export default DiaryDetail;
