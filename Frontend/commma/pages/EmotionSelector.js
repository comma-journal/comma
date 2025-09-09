// EmotionSelector.js
import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Alert,
    Animated,
    Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TextSelector from '../components/TextSelector';
import EmotionGrid from '../components/EmotionGrid';
import EmotionModal from '../components/EmotionModal';
import { emotionSelectorStyles } from '../styles/EmotionSelectorStyles';
import { emotions } from '../data/emotionsData';

const EmotionSelector = ({ navigation, route }) => {
    const { diary, isEditing } = route.params;

    const [content, setContent] = useState(diary.content);
    const [emotionSegments, setEmotionSegments] = useState(diary.emotionSegments || []);
    const [selectionStart, setSelectionStart] = useState(0);
    const [selectionEnd, setSelectionEnd] = useState(0);
    const [emotionModalVisible, setEmotionModalVisible] = useState(false);
    const [selectedText, setSelectedText] = useState('');
    const [selectedTextRange, setSelectedTextRange] = useState({ start: 0, end: 0 });
    const [selectedEmotion, setSelectedEmotion] = useState(null);
    const [isEditingEmotion, setIsEditingEmotion] = useState(false);
    const [editingSegmentId, setEditingSegmentId] = useState(null);

    // 하단 선택 바 애니메이션
    const bottomBarAnimation = useRef(new Animated.Value(0)).current;
    const [showBottomSelectionBar, setShowBottomSelectionBar] = useState(false);

    // 감정 선택 애니메이션
    const cardAnimations = useRef(
        emotions.map(() => ({
            scale: new Animated.Value(1),
            translateY: new Animated.Value(0),
        }))
    ).current;

    // 하단 선택 바 표시/숨김
    const showBottomSelectionBarFunc = () => {
        setShowBottomSelectionBar(true);
        Animated.timing(bottomBarAnimation, {
            toValue: 1,
            duration: 300,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
        }).start();
    };

    const hideBottomSelectionBar = () => {
        Animated.timing(bottomBarAnimation, {
            toValue: 0,
            duration: 200,
            easing: Easing.in(Easing.cubic),
            useNativeDriver: true,
        }).start(() => {
            setShowBottomSelectionBar(false);
        });
    };

    // 텍스트 선택 처리
    const handleSelectionChange = (event) => {
        const { start, end } = event.nativeEvent.selection;
        setSelectionStart(start);
        setSelectionEnd(end);

        if (start !== end) {
            const selected = content.slice(start, end);
            setSelectedText(selected);
            setSelectedTextRange({ start, end });
            showBottomSelectionBarFunc();
        } else {
            if (showBottomSelectionBar) {
                hideBottomSelectionBar();
            }
        }
    };

    // 저장하기
    const handleSave = async () => {
        Alert.alert(
            '저장 확인',
            '감정 선택이 완료되었나요?\n지금 저장하시겠습니까?',
            [
                {
                    text: '취소',
                    style: 'cancel',
                },
                {
                    text: '저장',
                    onPress: async () => {
                        try {
                            const finalDiary = {
                                ...diary,
                                emotionSegments: emotionSegments,
                                updatedAt: new Date().toISOString(),
                            };

                            // 기존 일기 목록 로드
                            const storedDiaries = await AsyncStorage.getItem('diaries');
                            let diaries = storedDiaries ? JSON.parse(storedDiaries) : [];

                            if (isEditing) {
                                // 수정 모드
                                diaries = diaries.map(d => d.id === diary.id ? finalDiary : d);
                            } else {
                                // 새 일기 추가
                                diaries.push(finalDiary);
                            }

                            await AsyncStorage.setItem('diaries', JSON.stringify(diaries));

                            Alert.alert(
                                '저장 완료',
                                '일기가 성공적으로 저장되었습니다.',
                                [
                                    {
                                        text: '확인',
                                        onPress: () => navigation.navigate('WriteList')
                                    }
                                ]
                            );
                        } catch (error) {
                            console.error('저장 오류:', error);
                            Alert.alert('오류', '저장 중 문제가 발생했습니다.');
                        }
                    }
                }
            ]
        );
    };

    // 감정 모달 열기
    const openEmotionModal = () => {
        if (selectionStart !== selectionEnd) {
            const selected = content.slice(selectionStart, selectionEnd);
            setSelectedText(selected);
            setSelectedTextRange({ start: selectionStart, end: selectionEnd });
            setEmotionModalVisible(true);
            setSelectedEmotion(null);
            setIsEditingEmotion(false);
            setEditingSegmentId(null);
            hideBottomSelectionBar();
        }
    };

    // 기존 감정 편집
    const editEmotion = (segment) => {
        setSelectedText(segment.text);
        setSelectedTextRange({ start: segment.start, end: segment.end });
        setSelectedEmotion(emotions.find(e => e.id === segment.emotionId));
        setIsEditingEmotion(true);
        setEditingSegmentId(segment.id);
        setEmotionModalVisible(true);
    };

    return (
        <SafeAreaView style={emotionSelectorStyles.container}>
            {/* 헤더 */}
            <View style={emotionSelectorStyles.header}>
                <TouchableOpacity
                    style={emotionSelectorStyles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Icon name="arrow-back" size={24} color="#333333" />
                </TouchableOpacity>

                <TouchableOpacity
                    style={emotionSelectorStyles.saveButton}
                    onPress={handleSave}
                >
                    <Icon name="save" size={20} color="#FFFFFF" />
                </TouchableOpacity>
            </View>

            {/* 제목 표시 */}
            <View style={emotionSelectorStyles.titleContainer}>
                <Text style={emotionSelectorStyles.title}>{diary.title}</Text>
                <Text style={emotionSelectorStyles.subtitle}>
                    문장을 선택하여 감정을 추가해보세요
                </Text>
            </View>

            {/* 텍스트 선택 영역 */}
            <TextSelector
                content={content}
                emotionSegments={emotionSegments}
                onSelectionChange={handleSelectionChange}
                onEditEmotion={editEmotion}
            />

            {/* 감정 통계 */}
            {emotionSegments.length > 0 && (
                <View style={emotionSelectorStyles.emotionStats}>
                    <View style={emotionSelectorStyles.statsHeader}>
                        <Text style={emotionSelectorStyles.statsTitle}>감정 통계</Text>
                        <View style={emotionSelectorStyles.statsCount}>
                            <Text style={emotionSelectorStyles.statsCountText}>
                                {emotionSegments.length}
                            </Text>
                        </View>
                    </View>

                    <ScrollView
                        style={emotionSelectorStyles.statsList}
                        showsVerticalScrollIndicator={false}
                    >
                        {emotionSegments
                            .sort((a, b) => a.start - b.start)
                            .map((segment) => (
                                <TouchableOpacity
                                    key={segment.id}
                                    style={emotionSelectorStyles.statsItem}
                                    onPress={() => editEmotion(segment)}
                                >
                                    <View style={[
                                        emotionSelectorStyles.statsIndicator,
                                        { backgroundColor: segment.emotionColor }
                                    ]}>
                                        <Text style={emotionSelectorStyles.statsIndicatorText}>
                                            {segment.emotionName}
                                        </Text>
                                    </View>

                                    <View style={emotionSelectorStyles.statsContent}>
                                        <Text style={emotionSelectorStyles.statsText} numberOfLines={2}>
                                            "{segment.text}"
                                        </Text>
                                        <Text style={emotionSelectorStyles.statsPosition}>
                                            위치: {segment.start + 1} ~ {segment.end}
                                        </Text>
                                    </View>

                                    <Icon name="edit" size={16} color="#999999" />
                                </TouchableOpacity>
                            ))
                        }
                    </ScrollView>
                </View>
            )}

            {/* 하단 선택 바 */}
            {showBottomSelectionBar && (
                <Animated.View
                    style={[
                        emotionSelectorStyles.bottomSelectionBar,
                        {
                            transform: [{
                                translateY: bottomBarAnimation.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [100, 0],
                                }),
                            }],
                            opacity: bottomBarAnimation,
                        },
                    ]}
                >
                    <View style={emotionSelectorStyles.bottomContent}>
                        <View style={emotionSelectorStyles.selectedTextInfo}>
                            <Icon name="format-quote" size={16} color="#666666" />
                            <Text style={emotionSelectorStyles.bottomText} numberOfLines={2}>
                                "{selectedText}"
                            </Text>
                        </View>
                        <TouchableOpacity
                            style={emotionSelectorStyles.bottomButton}
                            onPress={openEmotionModal}
                        >
                            <Icon name="sentiment-satisfied" size={18} color="#FFFFFF" />
                            <Text style={emotionSelectorStyles.bottomButtonText}>감정 선택</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            )}

            {/* 감정 선택 모달 */}
            <EmotionModal
                visible={emotionModalVisible}
                selectedText={selectedText}
                selectedEmotion={selectedEmotion}
                setSelectedEmotion={setSelectedEmotion}
                isEditingEmotion={isEditingEmotion}
                editingSegmentId={editingSegmentId}
                emotionSegments={emotionSegments}
                setEmotionSegments={setEmotionSegments}
                selectedTextRange={selectedTextRange}
                cardAnimations={cardAnimations}
                onClose={() => setEmotionModalVisible(false)}
            />
        </SafeAreaView>
    );
};

export default EmotionSelector;
