// components/EmotionModal.js
import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    TouchableWithoutFeedback,
    Alert,
    Animated,
    Easing,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import EmotionGrid from './EmotionGrid';
import { emotions } from '../data/emotionsData';
import { emotionModalStyles } from '../styles/components/EmotionModalStyles';

const EmotionModal = ({
    visible,
    selectedText,
    selectedEmotion,
    setSelectedEmotion,
    isEditingEmotion,
    editingSegmentId,
    emotionSegments,
    setEmotionSegments,
    selectedTextRange,
    cardAnimations,
    onClose,
}) => {
    // 감정 애니메이션 초기화
    const resetEmotionAnimations = () => {
        cardAnimations.forEach(anim => {
            anim.scale.setValue(1);
            anim.translateY.setValue(0);
        });
    };

    // 감정 선택 처리
    const handleEmotionSelect = (emotion) => {
        if (selectedEmotion && selectedEmotion.id === emotion.id) {
            setSelectedEmotion(null);
            resetEmotionAnimations();
            return;
        }

        // 기존 선택된 감정 애니메이션 초기화
        if (selectedEmotion) {
            const previousSelectedIndex = emotions.findIndex(e => e.id === selectedEmotion.id);
            if (previousSelectedIndex !== -1) {
                Animated.parallel([
                    Animated.timing(cardAnimations[previousSelectedIndex].scale, {
                        toValue: 1,
                        duration: 200,
                        easing: Easing.out(Easing.quad),
                        useNativeDriver: true,
                    }),
                    Animated.timing(cardAnimations[previousSelectedIndex].translateY, {
                        toValue: 0,
                        duration: 200,
                        easing: Easing.out(Easing.quad),
                        useNativeDriver: true,
                    }),
                ]).start();
            }
        }

        setSelectedEmotion(emotion);

        const selectedIndex = emotions.findIndex(e => e.id === emotion.id);

        // 새로 선택된 감정 카드 애니메이션
        Animated.parallel([
            Animated.spring(cardAnimations[selectedIndex].scale, {
                toValue: 1.1,
                friction: 6,
                tension: 150,
                useNativeDriver: true,
            }),
            Animated.timing(cardAnimations[selectedIndex].translateY, {
                toValue: -8,
                duration: 300,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            }),
        ]).start();
    };

    // 감정 적용
    const applyEmotion = () => {
        if (!selectedEmotion || !selectedText.trim()) {
            Alert.alert('오류', '감정과 텍스트를 선택해주세요.');
            return;
        }

        // 겹치는 세그먼트 확인
        const overlappingSegments = emotionSegments.filter(segment =>
            segment.start < selectedTextRange.end && segment.end > selectedTextRange.start
        );

        if (overlappingSegments.length > 0 && !isEditingEmotion) {
            Alert.alert(
                '기존 감정 삭제',
                '이미 감정이 선택된 부분이 있습니다. 기존의 감정은 삭제됩니다. 진행하시겠습니까?',
                [
                    { text: '취소', style: 'cancel' },
                    { text: '확인', onPress: saveEmotionReplace },
                ]
            );
            return;
        } else {
            saveEmotionReplace();
        }
    };

    const saveEmotionReplace = () => {
        const newSegment = {
            id: isEditingEmotion ? editingSegmentId : Date.now().toString(),
            text: selectedText,
            start: selectedTextRange.start,
            end: selectedTextRange.end,
            emotionId: selectedEmotion.id,
            emotionName: selectedEmotion.name,
            emotionColor: selectedEmotion.color,
        };

        if (isEditingEmotion) {
            setEmotionSegments(prev => prev.map(segment =>
                segment.id === editingSegmentId ? newSegment : segment
            ));
        } else {
            const filteredSegments = emotionSegments.filter(segment =>
                !(segment.start < selectedTextRange.end && segment.end > selectedTextRange.start)
            );
            setEmotionSegments([...filteredSegments, newSegment]);
        }

        closeModal();
    };

    // 감정 삭제
    const deleteEmotion = () => {
        Alert.alert(
            '감정 제거',
            '정말 감정을 제거하시겠습니까?',
            [
                { text: '취소', style: 'cancel' },
                {
                    text: '제거',
                    style: 'destructive',
                    onPress: () => {
                        setEmotionSegments(prev => prev.filter(segment => segment.id !== editingSegmentId));
                        closeModal();
                    }
                }
            ]
        );
    };

    const closeModal = () => {
        setSelectedEmotion(null);
        resetEmotionAnimations();
        onClose();
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={closeModal}
        >
            <TouchableWithoutFeedback onPress={closeModal}>
                <View style={emotionModalStyles.modalOverlay}>
                    <TouchableWithoutFeedback>
                        <View style={emotionModalStyles.modalContainer}>
                            {/* 헤더 */}
                            <View style={emotionModalStyles.modalHeader}>
                                <Text style={emotionModalStyles.modalTitle}>
                                    {isEditingEmotion ? '감정 수정하기' : '이 문장에 대한 감정 선택'}
                                </Text>
                                <TouchableOpacity onPress={closeModal}>
                                    <Icon name="close" size={24} color="#666666" />
                                </TouchableOpacity>
                            </View>

                            {/* 선택된 텍스트 */}
                            <View style={emotionModalStyles.selectedTextContainer}>
                                <Text style={emotionModalStyles.selectedTextLabel}>선택된 문장:</Text>
                                <Text style={emotionModalStyles.selectedTextDisplay}>"{selectedText}"</Text>
                            </View>

                            {/* 감정 그리드 */}
                            <EmotionGrid
                                selectedEmotion={selectedEmotion}
                                onEmotionSelect={handleEmotionSelect}
                                cardAnimations={cardAnimations}
                            />

                            {/* 선택된 감정 미리보기 */}
                            {selectedEmotion && (
                                <View style={emotionModalStyles.selectedEmotionInfo}>
                                    <View style={[
                                        emotionModalStyles.selectedEmotionPreview,
                                        { backgroundColor: selectedEmotion.color }
                                    ]}>
                                        <Text style={emotionModalStyles.selectedEmotionName}>
                                            {selectedEmotion.name}
                                        </Text>
                                    </View>
                                </View>
                            )}

                            {/* 버튼들 */}
                            <View style={emotionModalStyles.modalButtons}>
                                <TouchableOpacity
                                    style={emotionModalStyles.cancelButton}
                                    onPress={closeModal}
                                >
                                    <Text style={emotionModalStyles.cancelButtonText}>취소</Text>
                                </TouchableOpacity>

                                {isEditingEmotion && (
                                    <TouchableOpacity
                                        style={emotionModalStyles.deleteButton}
                                        onPress={deleteEmotion}
                                    >
                                        <Icon name="delete" size={16} color="#FFFFFF" />
                                        <Text style={emotionModalStyles.deleteButtonText}>삭제</Text>
                                    </TouchableOpacity>
                                )}

                                <TouchableOpacity
                                    style={[
                                        emotionModalStyles.applyButton,
                                        !selectedEmotion && emotionModalStyles.applyButtonDisabled
                                    ]}
                                    onPress={applyEmotion}
                                    disabled={!selectedEmotion}
                                >
                                    <Text style={emotionModalStyles.applyButtonText}>
                                        {isEditingEmotion ? '수정' : '적용'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

export default EmotionModal;
