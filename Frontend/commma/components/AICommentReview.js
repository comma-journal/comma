// components/AICommentReview.js
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Modal,
    TouchableWithoutFeedback,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { aiCommentReviewStyles } from '../styles/components/AICommentReviewStyles';
import CustomAlert from './CustomAlert';
import { useCustomAlert } from '../hooks/useCustomAlert';

const AICommentReview = ({
    visible,
    onClose,
    diaryData,
    onFinalSave,
    onReturnToEdit,
    onCancel,
    onStartAPICall,
}) => {
    const [loading, setLoading] = useState(true);
    const [comments, setComments] = useState([]);
    const [completedComments, setCompletedComments] = useState(new Set());
    const [selectedComment, setSelectedComment] = useState(null);
    const [commentModalVisible, setCommentModalVisible] = useState(false);
    const [actualDiaryData, setActualDiaryData] = useState(diaryData);
    const { alertConfig, showAlert, hideAlert } = useCustomAlert();

    // 모달이 열릴 때 즉시 API 호출 시작
    useEffect(() => {
        if (visible && onStartAPICall) {
            setLoading(true);
            setComments([]);
            setCompletedComments(new Set());
            startAPICallAndUpdateData();
        }
    }, [visible]);

    // API 호출 및 데이터 업데이트 함수
    const startAPICallAndUpdateData = async () => {
        try {
            setLoading(true);

            // API 호출과 최소 로딩 시간을 병렬로 처리
            const [updatedDiaryData] = await Promise.all([
                onStartAPICall(),
                new Promise(resolve => setTimeout(resolve, 5000))
            ]);

            setActualDiaryData(updatedDiaryData);

            if (updatedDiaryData?.annotation?.comments && updatedDiaryData.annotation.comments.length > 0) {
                setComments(updatedDiaryData.annotation.comments);
            } else {
                setComments([]);
            }

            // 로딩 완료
            setLoading(false);

        } catch (error) {
            setLoading(false);
            showAlert({
                title: '오류',
                message: 'AI 피드백을 가져오는 중 문제가 발생했습니다.',
                type: 'error',
                buttons: [
                    {
                        text: '확인',
                        onPress: () => {
                            hideAlert();
                            onClose();
                        }
                    }
                ]
            });
        }
    };

    // 코멘트 완료 처리
    const handleCompleteComment = (commentIndex) => {
        const newCompleted = new Set(completedComments);
        newCompleted.add(commentIndex);
        setCompletedComments(newCompleted);
        setCommentModalVisible(false);
    };

    // 코멘트 모달 열기
    const openCommentModal = (comment, index) => {
        setSelectedComment({ ...comment, index });
        setCommentModalVisible(true);
    };

    // 모든 코멘트 완료 확인
    const allCommentsCompleted = comments.length > 0 && completedComments.size === comments.length;

    // 수정하러 돌아가기 함수
    const handleReturnToEdit = () => {
        showAlert({
            title: '일기 수정',
            message: 'AI 피드백을 참고하여 일기를 수정하시겠습니까?',
            type: 'default',
            buttons: [
                {
                    text: '취소',
                    style: 'cancel',
                    onPress: hideAlert,
                },
                {
                    text: '수정하기',
                    onPress: () => {
                        hideAlert();
                        onReturnToEdit(actualDiaryData || diaryData);
                    }
                }
            ]
        });
    };

    // 최종 저장
    const handleFinalSave = () => {
        if (!allCommentsCompleted && comments.length > 0) {
            showAlert({
                title: '확인 필요',
                message: '모든 AI 질문을 확인해주세요.',
                type: 'warning',
                buttons: [{ text: '확인', onPress: hideAlert }]
            });
            return;
        }

        showAlert({
            title: '저장 확인',
            message: '일기를 최종 저장하시겠습니까?',
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
                        onFinalSave();
                    }
                }
            ]
        });
    };

    // 닫기 처리 (임시 저장 삭제 확인)
    const handleClose = () => {
        showAlert({
            title: '저장하지 않고 나가기',
            message: 'AI 피드백을 확인하지 않고 나가시겠습니까?\n임시로 저장된 일기는 삭제됩니다.',
            type: 'warning',
            buttons: [
                {
                    text: '취소',
                    style: 'cancel',
                    onPress: hideAlert,
                },
                {
                    text: '나가기',
                    style: 'destructive',
                    onPress: () => {
                        hideAlert();
                        if (onCancel) {
                            onCancel(); // 임시 저장 삭제 처리
                        }
                        onClose();
                    }
                }
            ]
        });
    };

    // 텍스트 렌더링 (문장 끝에 아이콘 하나만 표시)
    const renderTextWithComments = () => {
        const contentToRender = actualDiaryData?.content || diaryData?.content;

        if (!contentToRender || comments.length === 0) {
            return <Text style={aiCommentReviewStyles.contentText}>{contentToRender}</Text>;
        }

        // 유효한 코멘트만 필터링하고 위치 보정
        const validComments = [];
        comments.forEach((comment, index) => {
            if (!completedComments.has(index)) {
                // 위치가 유효한지 확인
                const start = Math.max(0, Math.min(comment.start, contentToRender.length));
                const end = Math.max(start, Math.min(comment.end, contentToRender.length));

                // 최소 길이 확보 (너무 짧은 선택 방지)
                const adjustedEnd = Math.max(start + 1, end);

                validComments.push({
                    ...comment,
                    index,
                    start,
                    end: adjustedEnd
                });
            }
        });

        if (validComments.length === 0) {
            return <Text style={aiCommentReviewStyles.contentText}>{contentToRender}</Text>;
        }

        // 문장 단위로 코멘트 위치 재조정
        const adjustedComments = validComments.map(comment => {
            const originalText = contentToRender.slice(comment.start, comment.end);

            // 문장의 끝을 찾아서 아이콘 위치 조정
            let adjustedEnd = comment.end;
            let searchStart = Math.max(0, comment.start - 10);
            let searchEnd = Math.min(contentToRender.length, comment.end + 30);
            let searchText = contentToRender.slice(searchStart, searchEnd);

            // 문장 끝 문자 찾기 (. ! ? 등)
            const sentenceEnders = ['.', '!', '?', '다.', '요.', '다!', '요!', '다?', '요?'];
            let bestEndPos = comment.end;

            for (let ender of sentenceEnders) {
                let pos = searchText.indexOf(ender, comment.start - searchStart);
                if (pos !== -1) {
                    let globalPos = searchStart + pos + ender.length;
                    if (globalPos > comment.start && globalPos <= comment.end + 20) {
                        bestEndPos = globalPos;
                        break;
                    }
                }
            }

            return {
                ...comment,
                end: Math.min(bestEndPos, contentToRender.length)
            };
        });

        // 코멘트 끝 위치에 아이콘 표시
        const commentEndPositions = new Map();
        adjustedComments.forEach(comment => {
            commentEndPositions.set(comment.end, comment);
        });

        const elements = [];
        let currentIndex = 0;
        const sortedEndPositions = Array.from(commentEndPositions.keys()).sort((a, b) => a - b);

        for (let endPos of sortedEndPositions) {
            const textSegment = contentToRender.slice(currentIndex, endPos);

            if (textSegment) {
                elements.push(
                    <Text key={`text-${currentIndex}`} style={aiCommentReviewStyles.contentText}>
                        {textSegment}
                    </Text>
                );
            }

            // 코멘트 아이콘 추가
            const commentData = commentEndPositions.get(endPos);
            elements.push(
                <TouchableOpacity
                    key={`comment-${endPos}`}
                    onPress={() => openCommentModal(commentData, commentData.index)}
                    style={aiCommentReviewStyles.commentIcon}
                >
                    <Icon name="chat-bubble" size={16} color="#FB644C" />
                </TouchableOpacity>
            );

            currentIndex = endPos;
        }

        // 마지막 남은 텍스트 추가
        if (currentIndex < contentToRender.length) {
            elements.push(
                <Text key={`text-final`} style={aiCommentReviewStyles.contentText}>
                    {contentToRender.slice(currentIndex)}
                </Text>
            );
        }

        return <Text style={aiCommentReviewStyles.contentText}>{elements}</Text>;
    };

    if (!visible) return null;

    return (
        <>
            <Modal
                animationType="slide"
                transparent={false}
                visible={visible}
                onRequestClose={handleClose}
            >
                <SafeAreaView style={aiCommentReviewStyles.container}>
                    {/* 헤더 */}
                    <View style={aiCommentReviewStyles.header}>
                        <TouchableOpacity onPress={handleClose}>
                            <Icon name="close" size={24} color="#333333" />
                        </TouchableOpacity>
                        <Text style={aiCommentReviewStyles.headerTitle}>AI 피드백 확인</Text>
                        <View style={aiCommentReviewStyles.headerButtons}>
                            <TouchableOpacity
                                style={aiCommentReviewStyles.editButton}
                                onPress={handleReturnToEdit}
                                disabled={loading}
                            >
                                <Icon name="edit" size={18} color={loading ? "#CCCCCC" : "#666666"} />
                                <Text style={[
                                    aiCommentReviewStyles.editButtonText,
                                    loading && { color: '#CCCCCC' }
                                ]}>수정</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    aiCommentReviewStyles.saveButton,
                                    (loading || (!allCommentsCompleted && comments.length > 0)) && aiCommentReviewStyles.saveButtonDisabled
                                ]}
                                onPress={handleFinalSave}
                                disabled={loading || (!allCommentsCompleted && comments.length > 0)}
                            >
                                <Icon name="save" size={18} color="#FFFFFF" />
                                <Text style={aiCommentReviewStyles.saveButtonText}>저장</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {loading ? (
                        <View style={aiCommentReviewStyles.loadingContainer}>
                            <ActivityIndicator size="large" color="#FB644C" />
                            <Text style={aiCommentReviewStyles.loadingText}>
                                AI가 일기를 분석하고 피드백을 생성하고 있습니다...{'\n'}
                                조금만 기다려주세요.
                            </Text>
                        </View>
                    ) : (
                        <>
                            {/* 피드백이 없는 경우 처리 */}
                            {comments.length === 0 ? (
                                <View style={aiCommentReviewStyles.noFeedbackContainer}>
                                    <Icon name="check-circle" size={80} color="#4CAF50" />
                                    <Text style={aiCommentReviewStyles.noFeedbackTitle}>
                                        완벽한 일기입니다!
                                    </Text>
                                    <Text style={aiCommentReviewStyles.noFeedbackMessage}>
                                        AI가 추가로 개선할 부분을 찾지 못했습니다.{'\n'}
                                        지금 상태로 저장하시겠습니까?
                                    </Text>
                                    <TouchableOpacity
                                        style={aiCommentReviewStyles.noFeedbackSaveButton}
                                        onPress={handleFinalSave}
                                    >
                                        <Text style={aiCommentReviewStyles.noFeedbackSaveButtonText}>
                                            저장하기
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <>
                                    {/* 진행 상황 */}
                                    <View style={aiCommentReviewStyles.progressContainer}>
                                        <Text style={aiCommentReviewStyles.progressText}>
                                            피드백 확인 진행상황: {completedComments.size}/{comments.length}
                                        </Text>
                                    </View>

                                    {/* 제목 - actualDiaryData 사용 */}
                                    <View style={aiCommentReviewStyles.titleContainer}>
                                        <Text style={aiCommentReviewStyles.title}>
                                            {actualDiaryData?.title || diaryData?.title}
                                        </Text>
                                    </View>

                                    {/* 내용 */}
                                    <ScrollView style={aiCommentReviewStyles.scrollView}>
                                        <View style={aiCommentReviewStyles.contentContainer}>
                                            {renderTextWithComments()}
                                        </View>
                                    </ScrollView>

                                    {/* 안내 텍스트 */}
                                    <View style={aiCommentReviewStyles.guideContainer}>
                                        <Text style={aiCommentReviewStyles.guideText}>
                                            💡 빨간 말풍선 아이콘을 터치하여 AI 피드백을 확인하고 "완료" 버튼을 눌러주세요.
                                        </Text>
                                    </View>
                                </>
                            )}
                        </>
                    )}
                </SafeAreaView>
            </Modal>

            {/* 코멘트 모달 */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={commentModalVisible}
                onRequestClose={() => setCommentModalVisible(false)}
            >
                <TouchableWithoutFeedback onPress={() => setCommentModalVisible(false)}>
                    <View style={aiCommentReviewStyles.modalOverlay}>
                        <TouchableWithoutFeedback onPress={() => { }}>
                            <View style={aiCommentReviewStyles.modalContainer}>
                                <View style={aiCommentReviewStyles.modalHeader}>
                                    <Text style={aiCommentReviewStyles.modalTitle}>AI 피드백</Text>
                                    <TouchableOpacity onPress={() => setCommentModalVisible(false)}>
                                        <Icon name="close" size={24} color="#666666" />
                                    </TouchableOpacity>
                                </View>

                                {selectedComment && (
                                    <View style={aiCommentReviewStyles.modalContent}>
                                        <View style={aiCommentReviewStyles.targetText}>
                                            <Text style={aiCommentReviewStyles.targetLabel}>선택된 문장:</Text>
                                            <Text style={aiCommentReviewStyles.targetContent}>
                                                "{(() => {
                                                    const content = actualDiaryData?.content || diaryData?.content || '';
                                                    const start = Math.max(0, Math.min(selectedComment.start, content.length));
                                                    const end = Math.max(start, Math.min(selectedComment.end, content.length));
                                                    return content.slice(start, end) || '텍스트를 찾을 수 없습니다.';
                                                })()}"
                                            </Text>
                                        </View>

                                        <View style={aiCommentReviewStyles.commentContent}>
                                            <Text style={aiCommentReviewStyles.commentLabel}>AI 질문:</Text>
                                            <Text style={aiCommentReviewStyles.commentText}>
                                                {selectedComment.content}
                                            </Text>
                                        </View>
                                    </View>
                                )}

                                <TouchableOpacity
                                    style={aiCommentReviewStyles.completeButton}
                                    onPress={() => handleCompleteComment(selectedComment?.index)}
                                >
                                    <Text style={aiCommentReviewStyles.completeButtonText}>완료</Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>

            <CustomAlert
                visible={alertConfig.visible}
                title={alertConfig.title}
                message={alertConfig.message}
                buttons={alertConfig.buttons}
                type={alertConfig.type}
                onBackdropPress={hideAlert}
            />
        </>
    );
};

export default AICommentReview;
