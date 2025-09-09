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
import EmotionGrid from '../components/EmotionGrid';
import EmotionModal from '../components/EmotionModal';
import CustomAlert from '../components/CustomAlert';
import { useCustomAlert } from '../hooks/useCustomAlert';
import { emotionSelectorStyles } from '../styles/EmotionSelectorStyles';
import { emotions } from '../data/emotionsData';

const EmotionSelector = ({ navigation, route }) => {
    const { diary, isEditing } = route.params;
    
    // 커스텀 Alert 추가
    const { alertConfig, showAlert, hideAlert } = useCustomAlert();
    
    const [title, setTitle] = useState(diary?.title || '');
    const [content, setContent] = useState(diary?.content || '');
    const [emotionSegments, setEmotionSegments] = useState(diary?.emotionSegments || []);
    const [selectionStart, setSelectionStart] = useState(0);
    const [selectionEnd, setSelectionEnd] = useState(0);
    const [emotionModalVisible, setEmotionModalVisible] = useState(false);
    const [selectedText, setSelectedText] = useState('');
    const [selectedTextRange, setSelectedTextRange] = useState({ start: 0, end: 0 });
    const [selectedEmotion, setSelectedEmotion] = useState(null);
    const [isEditingEmotion, setIsEditingEmotion] = useState(false);
    const [editingSegmentId, setEditingSegmentId] = useState(null);
    
    // 키보드 상태 관리
    const [keyboardVisible, setKeyboardVisible] = useState(false);
    
    // 저장 상태 관리
    const [isSaved, setIsSaved] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    
    // 초기 상태 저장 (변경사항 감지용)
    const initialState = useRef({
        title: diary?.title || '',
        content: diary?.content || '',
        emotionSegments: diary?.emotionSegments || []
    });
    
    // 이전 content를 추적하기 위한 ref
    const previousContentRef = useRef(content);

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

    // 변경사항 감지 useEffect
    useEffect(() => {
        const currentTitle = title;
        const currentContent = content;
        const currentSegments = emotionSegments;

        const titleChanged = currentTitle !== initialState.current.title;
        const contentChanged = currentContent !== initialState.current.content;
        const segmentsChanged = JSON.stringify(currentSegments) !== JSON.stringify(initialState.current.emotionSegments);

        const hasAnyChanges = titleChanged || contentChanged || segmentsChanged;
        setHasChanges(hasAnyChanges);

        // 변경사항이 있으면 저장 상태 초기화
        if (hasAnyChanges) {
            setIsSaved(false);
        }
    }, [title, content, emotionSegments]);

    // 페이지 벗어나기 전 확인
    useFocusEffect(
        useCallback(() => {
            const onBeforeRemove = (e) => {
                // 저장되었거나 변경사항이 없으면 자유롭게 나가기
                if (isSaved || !hasChanges) {
                    return;
                }

                // 변경사항이 있고 저장되지 않았으면 확인 알림
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
                                    await saveAndExit();
                                } catch (error) {
                                    console.error('저장 오류:', error);
                                    showAlert({
                                        title: '오류',
                                        message: '저장 중 문제가 발생했습니다.',
                                        type: 'error',
                                        buttons: [{ text: '확인', onPress: hideAlert }]
                                    });
                                }
                            }
                        },
                        {
                            text: '저장하지 않고 나가기',
                            style: 'destructive',
                            onPress: () => {
                                hideAlert();
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
        }, [isSaved, hasChanges, navigation, title, content, emotionSegments])
    );

    // 저장하고 나가기 함수
    const saveAndExit = async () => {
        if (!title.trim() && !content.trim()) {
            showAlert({
                title: '알림',
                message: '제목이나 내용을 입력해주세요.',
                type: 'warning',
                buttons: [{ text: '확인', onPress: hideAlert }]
            });
            return;
        }

        // 감정 선택 확인
        if (emotionSegments.length === 0) {
            showAlert({
                title: '감정 선택 안내',
                message: '감정이 하나도 선택되지 않았습니다.\n\n그래도 저장하고 나가시겠습니까?',
                type: 'warning',
                buttons: [
                    {
                        text: '취소',
                        style: 'cancel',
                        onPress: hideAlert,
                    },
                    {
                        text: '저장하고 나가기',
                        onPress: async () => {
                            hideAlert();
                            try {
                                await proceedWithSaveAndExit();
                            } catch (error) {
                                console.error('저장 오류:', error);
                                showAlert({
                                    title: '오류',
                                    message: '저장 중 문제가 발생했습니다.',
                                    type: 'error',
                                    buttons: [{ text: '확인', onPress: hideAlert }]
                                });
                            }
                        }
                    }
                ]
            });
            return;
        }

        // 감정이 있으면 바로 저장하고 나가기
        try {
            await proceedWithSaveAndExit();
        } catch (error) {
            console.error('저장 오류:', error);
            showAlert({
                title: '오류',
                message: '저장 중 문제가 발생했습니다.',
                type: 'error',
                buttons: [{ text: '확인', onPress: hideAlert }]
            });
        }
    };

    // 실제 저장하고 나가기 처리
    const proceedWithSaveAndExit = async () => {
        const finalDiary = {
            id: isEditing ? diary.id : Date.now().toString(),
            title: title.trim() || '제목 없음',
            content: content.trim(),
            emotionSegments: emotionSegments,
            createdAt: isEditing ? diary.createdAt : new Date().toISOString(),
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
        setIsSaved(true);

        // 잠시 후 페이지 이동
        setTimeout(() => {
            navigation.navigate('WriteList');
        }, 100);
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
            // 변경 지점과 겹치는 세그먼트는 제거
            else if (segmentStart < changeStart + Math.max(deletedLength, insertedLength)) {
                // 겹치는 세그먼트는 삭제
                // console.log(`Removing overlapping segment: "${segment.text}"`);
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

    // TextSelector에서 content 변경을 처리하는 함수 (경고 포함)
    const handleContentChange = (newContent) => {
        return new Promise((resolve) => {
            const oldContent = previousContentRef.current;

            // 감정 삭제 확인
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
                                // 감정 세그먼트 위치 업데이트
                                const updatedSegments = updateEmotionSegmentPositions(oldContent, newContent, emotionSegments);

                                setContent(newContent);
                                setEmotionSegments(updatedSegments);

                                // 이전 content 업데이트
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
                        text: '감정 없이 저장',
                        style: 'default',
                        onPress: () => {
                            hideAlert();
                            proceedWithSave();
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

        showAlert({
            title: '저장 확인',
            message: '일기를 저장하시겠습니까?',
            type: 'default',
            buttons: [
                {
                    text: '취소',
                    style: 'cancel',
                    onPress: hideAlert,
                },
                {
                    text: '저장',
                    onPress: () => {
                        hideAlert();
                        proceedWithSave();
                    }
                }
            ]
        });
    };

    // 실제 저장 처리 함수 (중복 제거)
    const proceedWithSave = async () => {
        try {
            const finalDiary = {
                id: isEditing ? diary.id : Date.now().toString(),
                title: title.trim() || '제목 없음',
                content: content.trim(),
                emotionSegments: emotionSegments,
                createdAt: isEditing ? diary.createdAt : new Date().toISOString(),
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
            setIsSaved(true); // 저장 상태 업데이트

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
            console.error('저장 오류:', error);
            showAlert({
                title: '오류',
                message: '저장 중 문제가 발생했습니다.',
                type: 'error',
                buttons: [{ text: '확인', onPress: hideAlert }]
            });
        }
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
                content1={content}
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
                onClose={() => setEmotionModalVisible(false)}
            />

            {/* 커스텀 Alert 추가 */}
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

export default EmotionSelector;
