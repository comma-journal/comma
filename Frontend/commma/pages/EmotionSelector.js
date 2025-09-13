// EmotionSelector.js
import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Animated,
    Easing,
    Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TextSelector from '../components/TextSelector';
import EmotionModal from '../components/EmotionModal';
import CustomAlert from '../components/CustomAlert';
import { useCustomAlert } from '../hooks/useCustomAlert';
import { emotionSelectorStyles } from '../styles/EmotionSelectorStyles';
import { useEmotionsData } from '../hooks/useEmotionsData';
import { API_BASE_URL, getAuthToken, getAuthHeaders } from '../api/config';
import AICommentReview from '../components/AICommentReview';

const EmotionSelector = ({ navigation, route }) => {
    const { diary, isEditing } = route.params;

    const { emotions, emotionCategories, isLoading: emotionsLoading, error: emotionsError } = useEmotionsData();
    const { alertConfig, showAlert, hideAlert } = useCustomAlert();

    const [title, setTitle] = useState(diary?.title || '');
    const [content, setContent] = useState(diary?.content || '');

    const [tempSavedDiaryId, setTempSavedDiaryId] = useState(null);
    const [isTemporarySave, setIsTemporarySave] = useState(false);

    const isSavingRef = useRef(false);
    const [emotionSegments, setEmotionSegments] = useState(() => {
        // 백엔드 데이터 형식을 로컬 형식으로 변환
        if (diary?.annotation) {
            return diary.annotation.highlights.map(highlight => ({
                id: `${highlight.start}-${highlight.end}-${highlight.emotion.id}`,
                text: diary.content.slice(highlight.start, highlight.end),
                start: highlight.start,
                end: highlight.end,
                emotionId: highlight.emotion.id,
                emotionName: highlight.emotion.name,
                emotionColor: `#${highlight.emotion.rgb.toString(16).padStart(6, '0')}`,
            }));
        }
        return [];
    });
    const [selectionStart, setSelectionStart] = useState(0);
    const [selectionEnd, setSelectionEnd] = useState(0);
    const [emotionModalVisible, setEmotionModalVisible] = useState(false);
    const [selectedText, setSelectedText] = useState('');
    const [selectedTextRange, setSelectedTextRange] = useState({ start: 0, end: 0 });
    const [selectedEmotion, setSelectedEmotion] = useState(null);
    const [isEditingEmotion, setIsEditingEmotion] = useState(false);
    const [editingSegmentId, setEditingSegmentId] = useState(null);
    const [aiCommentReviewVisible, setAiCommentReviewVisible] = useState(false);
    const [savedDiaryData, setSavedDiaryData] = useState(null);
    const [keyboardVisible, setKeyboardVisible] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);

    const formatDateToYYYYMMDD = (date) => {
        if (!date) {
            date = new Date();
        }

        // Date 객체가 아닌 경우 변환
        if (typeof date === 'string') {
            date = new Date(date);
        }

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    };

    // 임시 저장된 일기 삭제
    const deleteTempDiary = async () => {
        if (!tempSavedDiaryId || !isTemporarySave) return;

        try {
            const token = await getAuthToken();
            if (!token) return;

            const response = await fetch(`${API_BASE_URL}/me/diary/${tempSavedDiaryId}`, {
                method: 'DELETE',
                headers: getAuthHeaders(token),
            });

            if (response.ok) {
                setTempSavedDiaryId(null);
                setIsTemporarySave(false);
            }
        } catch (error) {
            // console.error('임시 일기 삭제 중 오류:', error);
        }
    };

    // 초기 상태 저장
    const initialState = useRef({
        title: diary?.title || '',
        content: diary?.content || '',
        emotionSegments: (() => {
            if (diary?.annotation) {
                return diary.annotation.highlights.map(highlight => ({
                    id: `${highlight.start}-${highlight.end}-${highlight.emotion.id}`,
                    text: diary.content.slice(highlight.start, highlight.end),
                    start: highlight.start,
                    end: highlight.end,
                    emotionId: highlight.emotion.id,
                    emotionName: highlight.emotion.name,
                    emotionColor: `#${highlight.emotion.rgb.toString(16).padStart(6, '0')}`,
                }));
            }
            return [];
        })()
    });

    // 이전 content를 추적하기 위한 ref
    const previousContentRef = useRef(content);

    // 하단 선택 바 애니메이션
    const bottomBarAnimation = useRef(new Animated.Value(0)).current;
    const [showBottomSelectionBar, setShowBottomSelectionBar] = useState(false);

    // 감정 선택 애니메이션 (emotions 배열 길이에 따라 동적 생성)
    const cardAnimations = useRef([]).current;

    // emotions가 로딩되면 애니메이션 배열 초기화
    useEffect(() => {
        if (emotions.length > 0) {
            cardAnimations.splice(0, cardAnimations.length);
            emotions.forEach(() => {
                cardAnimations.push({
                    scale: new Animated.Value(1),
                    translateY: new Animated.Value(0),
                });
            });
        }
    }, [emotions]);

    // 키보드 이벤트 리스너
    useEffect(() => {
        const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
            setKeyboardVisible(true);
        });
        const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
            setKeyboardVisible(false);
        });

        return () => {
            showSubscription?.remove();
            hideSubscription?.remove();
        };
    }, []);

    useEffect(() => {
        const currentTitle = title;
        const currentContent = content;
        const currentSegments = emotionSegments;

        const titleChanged = currentTitle !== initialState.current.title;
        const contentChanged = currentContent !== initialState.current.content;
        const segmentsChanged = JSON.stringify(currentSegments) !== JSON.stringify(initialState.current.emotionSegments);

        const hasAnyChanges = titleChanged || contentChanged || segmentsChanged;
        setHasChanges(hasAnyChanges);

        if (hasAnyChanges) {
            setIsSaved(false);
        }
    }, [title, content, emotionSegments]);

    // 컴포넌트 언마운트 시 임시 저장 정리
    useEffect(() => {
        return () => {
            if (isTemporarySave && tempSavedDiaryId && !isSaved) {
                deleteTempDiary();
            }
        };
    }, []);

    // 페이지 벗어나기 전 확인
    useFocusEffect(
        useCallback(() => {
            const onBeforeRemove = async (e) => {
                if (isSaved || !hasChanges) {
                    return;
                }

                e.preventDefault();

                showAlert({
                    title: '주의',
                    message: '저장하지 않은 변경사항이 있습니다.\n페이지를 벗어나면 작성한 내용이 사라집니다.\n\n계속하시겠습니까?',
                    type: 'warning',
                    buttons: [
                        {
                            text: '저장하고 나가기',
                            onPress: async () => {
                                hideAlert();
                                try {
                                    await handleDirectSave();
                                } catch (error) {
                                    console.error('저장 오류:', error);
                                }
                            }
                        },
                        {
                            text: '저장하지 않고 나가기',
                            style: 'destructive',
                            onPress: async () => {
                                hideAlert();
                                if (isTemporarySave && tempSavedDiaryId) {
                                    await deleteTempDiary();
                                }
                                navigation.dispatch(e.data.action);
                            },
                        },
                        {
                            text: '취소',
                            style: 'cancel',
                            onPress: hideAlert
                        },
                    ]
                });
            };

            navigation.addListener('beforeRemove', onBeforeRemove);
            return () => navigation.removeListener('beforeRemove', onBeforeRemove);
        }, [isSaved, hasChanges, navigation, isTemporarySave, tempSavedDiaryId])
    );

    // 일기 저장 및 AI 코멘트 받기
    const saveDiaryAndGetAIComments = async () => {
        try {
            const token = await getAuthToken();
            if (!token) {
                throw new Error('토큰이 없습니다.');
            }

            // entryDate 설정
            let entryDate;
            if (isEditing && diary?.entryDate) {
                entryDate = diary.entryDate;
            } else if (isEditing && diary?.createdAt) {
                entryDate = formatDateToYYYYMMDD(new Date(diary.createdAt));
            } else {
                entryDate = formatDateToYYYYMMDD(new Date());
            }

            const requestBody = {
                title: title.trim() || '제목 없음',
                content: content.trim(),
                entryDate: entryDate,
                annotation: {
                    comments: [],
                    highlights: emotionSegments.map(segment => ({
                        start: segment.start,
                        end: segment.end,
                        emotion: {
                            id: segment.emotionId,
                            name: segment.emotionName,
                            rgb: parseInt(segment.emotionColor.replace('#', ''), 16),
                            description: ""
                        }
                    }))
                }
            };

            const url = isEditing
                ? `${API_BASE_URL}/me/diary/${diary.id}`
                : `${API_BASE_URL}/me/diary`;

            const method = isEditing ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: getAuthHeaders(token),
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
            }

            const responseData = await response.json();

            // 새로 생성된 경우만 임시 저장으로 표시
            if (!isEditing && method === 'POST' && !tempSavedDiaryId) {
                setTempSavedDiaryId(responseData.id);
                setIsTemporarySave(true);
            }

            return {
                id: responseData.id,
                title: responseData.title,
                content: responseData.content,
                entryDate: responseData.entryDate,
                createdAt: responseData.createdAt,
                updatedAt: responseData.updatedAt,
                annotation: responseData.annotation,
                topEmotion: responseData.topEmotion
            };

        } catch (error) {
            throw error;
        }
    };

    // AI 코멘트 리뷰 완료 후 최종 저장
    const handleFinalSave = () => {
        setIsSaved(true);
        setIsTemporarySave(false);
        setAiCommentReviewVisible(false);

        showAlert({
            title: '저장 완료',
            message: '일기가 성공적으로 저장되었습니다.',
            type: 'success',
            buttons: [
                {
                    text: '확인',
                    onPress: () => {
                        hideAlert();
                        navigation.navigate('WriteList');
                    }
                }
            ]
        });
    };

    const handleContentChange = (newContent) => {
        return new Promise((resolve) => {
            const oldContent = previousContentRef.current;
            const { willDelete, segmentsToDelete } = checkForEmotionDeletion(oldContent, newContent, emotionSegments);

            if (willDelete && segmentsToDelete.length > 0) {
                const emotionNames = segmentsToDelete.map(segment => segment.emotionName).join(', ');
                const segmentTexts = segmentsToDelete.map(segment => `"${segment.text}"`).join(', ');

                showAlert({
                    title: '감정 삭제 경고',
                    message: `이 작업으로 다음 텍스트의 감정이 삭제됩니다:\n\n${segmentTexts}\n\n감정: ${emotionNames}\n\n계속하시겠습니까?`,
                    type: 'warning',
                    buttons: [
                        {
                            text: '취소',
                            style: 'cancel',
                            onPress: () => {
                                hideAlert();
                                resolve(false);
                            }
                        },
                        {
                            text: '계속',
                            style: 'destructive',
                            onPress: () => {
                                hideAlert();
                                const updatedSegments = updateEmotionSegmentPositions(oldContent, newContent, emotionSegments);

                                setContent(newContent);
                                setEmotionSegments(updatedSegments);

                                previousContentRef.current = newContent;
                                resolve(true);
                            }
                        }
                    ]
                });
            } else {
                // 감정 삭제가 없는 경우 바로 업데이트
                const updatedSegments = updateEmotionSegmentPositions(oldContent, newContent, emotionSegments);

                setContent(newContent);
                setEmotionSegments(updatedSegments);

                // 이전 content 업데이트
                previousContentRef.current = newContent;
                resolve(true);
            }
        });
    };

    // 실제 저장하고 나가기 처리
    const proceedWithSaveAndExit = async () => {
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

            const today = new Date().toISOString().split('T')[0];

            const requestBody = {
                title: title.trim() || '제목 없음',
                content: content.trim(),
                entryDate: today,
                annotation: {
                    comments: [],
                    highlights: emotionSegments.map(segment => ({
                        start: segment.start,
                        end: segment.end,
                        emotion: {
                            id: segment.emotionId,
                            name: segment.emotionName,
                            rgb: parseInt(segment.emotionColor.replace('#', ''), 16),
                            description: ""
                        }
                    }))
                }
            };

            const url = isEditing
                ? `${API_BASE_URL}/me/diary/${diary.id}`
                : `${API_BASE_URL}/me/diary`;

            const method = isEditing ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            setIsSaved(true);

            return true;

        } catch (error) {
            if (error.message.includes('로그인 정보가 없습니다') ||
                error.message.includes('토큰이 없습니다')) {
                showAlert({
                    title: '로그인 필요',
                    message: '로그인이 필요합니다.',
                    type: 'warning',
                    buttons: [
                        {
                            text: '확인',
                            onPress: () => {
                                hideAlert();
                                navigation.reset({
                                    index: 0,
                                    routes: [{ name: 'Login' }],
                                });
                            }
                        }
                    ]
                });
            } else {
                throw error;
            }
        }
    };

    // 삭제될 감정 세그먼트 확인 함수
    const checkForEmotionDeletion = (oldContent, newContent, segments) => {
        if (segments.length === 0) return { willDelete: false, segmentsToDelete: [] };

        // 텍스트 변경 지점 찾기
        let changeStart = 0;
        let changeEnd = oldContent.length;

        // 앞에서부터 같은 부분 찾기
        while (changeStart < Math.min(oldContent.length, newContent.length) &&
            oldContent[changeStart] === newContent[changeStart]) {
            changeStart++;
        }

        // 뒤에서부터 같은 부분 찾기
        let oldEnd = oldContent.length - 1;
        let newEnd = newContent.length - 1;
        while (oldEnd >= changeStart && newEnd >= changeStart &&
            oldContent[oldEnd] === newContent[newEnd]) {
            oldEnd--;
            newEnd--;
        }

        const deletedLength = (oldEnd + 1) - changeStart;
        const insertedLength = (newEnd + 1) - changeStart;

        // 삭제될 세그먼트들 찾기
        const segmentsToDelete = segments.filter(segment => {
            const segmentStart = segment.start;
            const segmentEnd = segment.end;

            // 변경 지점과 겹치는 세그먼트
            return segmentStart < changeStart + Math.max(deletedLength, insertedLength) &&
                segmentEnd > changeStart;
        });

        return {
            willDelete: segmentsToDelete.length > 0,
            segmentsToDelete: segmentsToDelete
        };
    };

    // 감정 세그먼트 위치 업데이트 함수
    const updateEmotionSegmentPositions = (oldContent, newContent, segments) => {
        if (segments.length === 0) return segments;

        const updatedSegments = [];

        // 텍스트 변경 지점 찾기
        let changeStart = 0;
        let changeEnd = oldContent.length;

        // 앞에서부터 같은 부분 찾기
        while (changeStart < Math.min(oldContent.length, newContent.length) &&
            oldContent[changeStart] === newContent[changeStart]) {
            changeStart++;
        }

        // 뒤에서부터 같은 부분 찾기
        let oldEnd = oldContent.length - 1;
        let newEnd = newContent.length - 1;
        while (oldEnd >= changeStart && newEnd >= changeStart &&
            oldContent[oldEnd] === newContent[newEnd]) {
            oldEnd--;
            newEnd--;
        }

        const deletedLength = (oldEnd + 1) - changeStart;
        const insertedLength = (newEnd + 1) - changeStart;
        const lengthDiff = insertedLength - deletedLength;

        segments.forEach(segment => {
            const segmentStart = segment.start;
            const segmentEnd = segment.end;

            // 변경 지점보다 앞에 있는 세그먼트는 그대로 유지
            if (segmentEnd <= changeStart) {
                updatedSegments.push(segment);
            }
            // 변경 지점보다 뒤에 있는 세그먼트는 위치 조정
            else {
                const newStart = segmentStart + lengthDiff;
                const newEnd = segmentEnd + lengthDiff;

                // 새로운 위치가 유효한 범위 내에 있는지 확인
                if (newStart >= 0 && newEnd <= newContent.length && newStart < newEnd) {
                    const newText = newContent.slice(newStart, newEnd);
                    updatedSegments.push({
                        ...segment,
                        start: newStart,
                        end: newEnd,
                        text: newText
                    });
                }
            }
        });

        return updatedSegments;
    };

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
        const start = event.start;
        const end = event.end;
        const content2 = event.content;

        setSelectionStart(start);
        setSelectionEnd(end);

        if (start !== end) {
            const selected = content2.slice(start, end);
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
        if (!title.trim() && !content.trim()) {
            showAlert({
                title: '알림',
                message: '제목이나 내용을 입력해주세요.',
                type: 'warning',
                buttons: [{ text: '확인', onPress: hideAlert }]
            });
            return;
        }

        // AI 피드백 보기 또는 바로 저장 선택
        showAlert({
            title: '저장 방식 선택',
            message: 'AI 피드백을 받아 일기를 개선하시겠습니까?\n아니면 바로 저장하시겠습니까?',
            type: 'default',
            buttons: [
                {
                    text: '취소',
                    style: 'cancel',
                    onPress: hideAlert,
                },
                {
                    text: 'AI 피드백 보기',
                    onPress: () => {
                        hideAlert();
                        handleAIFeedback();
                    }
                },
                {
                    text: '바로 저장',
                    onPress: () => {
                        hideAlert();
                        handleDirectSave();
                    }
                }
            ]
        });
    };

    // AI 피드백 받기
    const handleAIFeedback = () => {
        if (emotionSegments.length === 0) {
            showAlert({
                title: '감정 선택 확인',
                message: '아직 감정이 하나도 선택되지 않았습니다.\n\n문장을 선택하여 감정을 추가하시겠습니까?',
                type: 'warning',
                buttons: [
                    {
                        text: '감정 추가하기',
                        style: 'default',
                        onPress: () => {
                            hideAlert();
                            showAlert({
                                title: '감정 추가 방법',
                                message: '텍스트에서 감정을 표현하고 싶은 문장을 선택한 후 하단의 "감정 선택" 버튼을 눌러주세요.',
                                type: 'default',
                                buttons: [{ text: '확인', onPress: hideAlert }]
                            });
                        }
                    },
                    {
                        text: '감정 없이 피드백 받기',
                        style: 'default',
                        onPress: () => {
                            hideAlert();
                            openAIReviewModal();
                        }
                    },
                    {
                        text: '취소',
                        style: 'cancel',
                        onPress: hideAlert
                    }
                ]
            });
            return;
        }

        openAIReviewModal();
    };

    const openAIReviewModal = () => {
        // 임시 데이터로 모달을 즉시 열기
        const tempDiaryData = {
            id: null,
            title: title.trim() || '제목 없음',
            content: content.trim(),
            annotation: {
                comments: [], // 로딩 중이므로 빈 배열
                highlights: emotionSegments.map(segment => ({
                    start: segment.start,
                    end: segment.end,
                    emotion: {
                        id: segment.emotionId,
                        name: segment.emotionName,
                        rgb: parseInt(segment.emotionColor.replace('#', ''), 16),
                        description: ""
                    }
                }))
            }
        };

        setSavedDiaryData(tempDiaryData);
        setAiCommentReviewVisible(true);
    };

    // 바로 저장 처리
    const handleDirectSave = async () => {
        if (isSavingRef.current) {
            return;
        }

        try {
            isSavingRef.current = true;
            await proceedWithDirectSave();
            showAlert({
                title: '저장 완료',
                message: '일기가 성공적으로 저장되었습니다.',
                type: 'success',
                buttons: [
                    {
                        text: '확인',
                        onPress: () => {
                            hideAlert();
                            navigation.navigate('WriteList');
                        }
                    }
                ]
            });
        } catch (error) {
            showAlert({
                title: '오류',
                message: '저장 중 문제가 발생했습니다.',
                type: 'error',
                buttons: [{ text: '확인', onPress: hideAlert }]
            });
        } finally {
            isSavingRef.current = false;
        }
    };

    // 바로 저장 API 호출
    const proceedWithDirectSave = async () => {
        try {
            const token = await getAuthToken();
            if (!token) {
                throw new Error('토큰이 없습니다.');
            }

            let entryDate;
            if (isEditing && diary?.entryDate) {
                entryDate = diary.entryDate;
            } else if (isEditing && diary?.createdAt) {
                entryDate = formatDateToYYYYMMDD(new Date(diary.createdAt));
            } else {
                entryDate = formatDateToYYYYMMDD(new Date());
            }

            const requestBody = {
                title: title.trim() || '제목 없음',
                content: content.trim(),
                entryDate: entryDate,
                annotation: {
                    comments: [],
                    highlights: emotionSegments.map(segment => ({
                        start: segment.start,
                        end: segment.end,
                        emotion: {
                            id: segment.emotionId,
                            name: segment.emotionName,
                            rgb: parseInt(segment.emotionColor.replace('#', ''), 16),
                            description: ""
                        }
                    }))
                }
            };

            // AI 피드백 후 수정하는 경우: 기존 임시 일기를 삭제하고 새로 생성
            if (tempSavedDiaryId && isTemporarySave) {
                await fetch(`${API_BASE_URL}/me/diary/${tempSavedDiaryId}`, {
                    method: 'DELETE',
                    headers: getAuthHeaders(token),
                });

                const response = await fetch(`${API_BASE_URL}/me/diary`, {
                    method: 'POST',
                    headers: getAuthHeaders(token),
                    body: JSON.stringify(requestBody),
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
                }

                setTempSavedDiaryId(null);
                setIsTemporarySave(false);
            } else {
                const url = isEditing
                    ? `${API_BASE_URL}/me/diary/${diary.id}`
                    : `${API_BASE_URL}/me/diary`;

                const method = isEditing ? 'PUT' : 'POST';

                const response = await fetch(url, {
                    method,
                    headers: getAuthHeaders(token),
                    body: JSON.stringify(requestBody),
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
                }
            }

            setIsSaved(true);
            return true;

        } catch (error) {
            throw error;
        }
    };

    const handleReturnFromAIReview = (updatedDiary) => {
        if (updatedDiary) {
            setTitle(updatedDiary.title || title);
            setContent(updatedDiary.content || content);
            setSavedDiaryData(updatedDiary);

            if (updatedDiary.id && !isEditing) {
                setTempSavedDiaryId(updatedDiary.id);
                setIsTemporarySave(true);
            }
        }
        setAiCommentReviewVisible(false);
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

    // 감정 데이터 로딩 중이거나 에러가 있을 때의 처리
    if (emotionsLoading) {
        return (
            <SafeAreaView style={emotionSelectorStyles.container}>
                <View style={emotionSelectorStyles.loadingContainer}>
                    <Text style={emotionSelectorStyles.loadingText}>감정 데이터를 불러오는 중...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (emotionsError) {
        return (
            <SafeAreaView style={emotionSelectorStyles.container}>
                <View style={emotionSelectorStyles.errorContainer}>
                    <Text style={emotionSelectorStyles.errorText}>감정 데이터를 불러올 수 없습니다.</Text>
                    <TouchableOpacity
                        style={emotionSelectorStyles.retryButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={emotionSelectorStyles.retryButtonText}>돌아가기</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

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

            {/* 제목 입력 영역 */}
            <View style={emotionSelectorStyles.titleInputContainer}>
                <TextInput
                    style={emotionSelectorStyles.titleInput}
                    placeholder="일기 제목을 입력하세요"
                    placeholderTextColor="#999999"
                    value={title}
                    onChangeText={setTitle}
                    maxLength={50}
                    selectionColor="#FB644C"
                />
            </View>

            {/* 안내 텍스트 */}
            <View style={emotionSelectorStyles.subtitleContainer}>
                <Text style={emotionSelectorStyles.subtitle}>
                    아래에서 일기를 작성하고 문장을 선택(드래그)하여 감정을 추가해보세요.
                </Text>
            </View>

            {/* 텍스트 선택 영역 */}
            <TextSelector
                savedContent={content}
                emotionSegments={emotionSegments}
                onSelectionChangeCallBack={handleSelectionChange}
                onContentChange={handleContentChange}
                onEditEmotion={editEmotion}
            />

            {/* 감정 통계 - 키보드가 열렸을 때 숨김 */}
            {!keyboardVisible && emotionSegments.length > 0 && (
                <View style={emotionSelectorStyles.emotionStats}>
                    <View style={emotionSelectorStyles.statsHeader}>
                        <Text style={emotionSelectorStyles.statsTitle}>선택된 감정</Text>
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
                emotions={emotions}
                emotionCategories={emotionCategories}
                onClose={() => setEmotionModalVisible(false)}
            />

            <CustomAlert
                visible={alertConfig.visible}
                title={alertConfig.title}
                message={alertConfig.message}
                buttons={alertConfig.buttons}
                type={alertConfig.type}
                onBackdropPress={hideAlert}
            />

            {/* AI 코멘트 리뷰 모달 */}
            <AICommentReview
                visible={aiCommentReviewVisible}
                onClose={() => setAiCommentReviewVisible(false)}
                diaryData={savedDiaryData}
                onFinalSave={handleFinalSave}
                onReturnToEdit={handleReturnFromAIReview}
                onCancel={deleteTempDiary}
                onStartAPICall={saveDiaryAndGetAIComments}
                emotionSegments={emotionSegments}
                title={title}
                content={content}
                formatDateToYYYYMMDD={formatDateToYYYYMMDD}
                isEditing={isEditing}
                diary={diary}
            />
        </SafeAreaView>
    );
};

export default EmotionSelector;
