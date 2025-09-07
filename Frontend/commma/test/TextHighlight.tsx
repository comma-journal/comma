// src/components/TextHighlight.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Button,
    TouchableOpacity,
    Modal,
    TextInput,
    Alert,
    Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface BubbleData {
    id: string;
    paragraph: number;
    sentence: number;
    question: string;
    answer: string;
    type: 'question' | 'note' | 'reflection';
}

interface HighlightData {
    paragraph: number;
    sentence: number;
    type: string;
    note: string;
}

const TextHighlight = () => {
    const [textData, setTextData] = useState<string[]>([]);
    const [highlightData, setHighlightData] = useState<HighlightData[]>([]);
    const [bubbleData, setBubbleData] = useState<BubbleData[]>([]);
    const [selectedBubble, setSelectedBubble] = useState<BubbleData | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [tempAnswer, setTempAnswer] = useState('');

    // 백엔드 데이터 시뮬레이션
    const mockBackendData = {
        text: [
            "리액트 네이티브는 Facebook에서 개발한 모바일 앱 개발 프레임워크입니다. JavaScript와 React를 사용하여 iOS와 Android 앱을 동시에 개발할 수 있습니다. 크로스 플랫폼 개발의 대표적인 솔루션 중 하나입니다.",
            "리액트 네이티브의 주요 장점은 코드 재사용성입니다. 하나의 코드베이스로 여러 플랫폼에 배포할 수 있어 개발 시간과 비용을 절약할 수 있습니다. 또한 핫 리로딩 기능으로 개발 생산성이 높습니다.",
            "최근에는 많은 기업들이 리액트 네이티브를 도입하고 있습니다. Facebook, Instagram, Airbnb 등이 대표적인 사례입니다."
        ],
        highlights: [
            {
                paragraph: 0,
                sentence: 0,
                type: 'question',
                note: '핵심 정보'
            },
            {
                paragraph: 1,
                sentence: 1,
                type: 'important',
                note: '주의사항'
            }
            ,
            {
                paragraph: 2,
                sentence: 0,
                type: 'warning',
                note: '사례'
            }
        ],
        // 백엔드에서 받는 말풍선 위치 데이터
        bubbles: [
            {
                id: '1',
                paragraph: 0,
                sentence: 0,
                question: '크로스 플랫폼 개발의 다른 장점은 무엇인가요?',
                answer: '',
                type: 'question'
            },
            {
                id: '2',
                paragraph: 1,
                sentence: 1,
                question: '코드 재사용성이 중요한 이유는 무엇인가요?',
                answer: '',
                type: 'important'
            },
            {
                id: '3',
                paragraph: 2,
                sentence: 1,
                question: '이런 사례들을 보고 어떤 생각이 드시나요?',
                answer: '',
                type: 'note'
            }
        ]
    };

    useEffect(() => {
        // 실제 구현에서는 API 호출
        setTextData(mockBackendData.text);
        setHighlightData(mockBackendData.highlights);
        setBubbleData(mockBackendData.bubbles);
    }, []);

    // 하이라이트 스타일을 타입에 따라 반환
    const getHighlightStyle = (highlightType: string) => {
        const styleMap: { [key: string]: any } = {
            important: styles.importantHighlight,
            warning: styles.warningHighlight,
            example: styles.exampleHighlight,
            default: styles.defaultHighlight,
        };

        return styleMap[highlightType] || styleMap.default;
    };

    // 말풍선 스타일을 타입에 따라 반환
    const getBubbleStyle = (bubbleType: string) => {
        const styleMap: { [key: string]: any } = {
            question: styles.questionBubble,
            note: styles.noteBubble,
            reflection: styles.reflectionBubble,
        };

        return styleMap[bubbleType] || styles.questionBubble;
    };

    // 말풍선 클릭 핸들러
    const handleBubblePress = (bubbleWithSentence: any) => {
        setSelectedBubble(bubbleWithSentence);
        setTempAnswer(bubbleWithSentence.answer);
        setModalVisible(true);
    };

    // 답변 저장 핸들러
    const handleSaveAnswer = () => {
        if (selectedBubble) {
            setBubbleData(prevBubbles =>
                prevBubbles.map(bubble =>
                    bubble.id === selectedBubble.id
                        ? { ...bubble, answer: tempAnswer }
                        : bubble
                )
            );
            setModalVisible(false);
            setSelectedBubble(null);
            setTempAnswer('');
            Alert.alert('저장 완료', '답변이 저장되었습니다.');
        }
    };

    // 모달 취소 핸들러
    const handleCancel = () => {
        setModalVisible(false);
        setSelectedBubble(null);
        setTempAnswer('');
    };

    // 새 말풍선 추가 (백엔드 API 호출 시뮬레이션)
    const addBubble = () => {
        const newBubble: BubbleData = {
            id: Date.now().toString(),
            paragraph: 0,
            sentence: 2,
            question: '새로 추가된 질문입니다',
            answer: '',
            type: 'question'
        };

        setBubbleData(prev => [...prev, newBubble]);
    };

    const splitIntoSentences = (paragraph: string) => {
        return paragraph.split(/(?<=[.!?])\s+/).filter(sentence => sentence.trim());
    };

    const getHighlightForSentence = (paragraphIndex: number, sentenceIndex: number) => {
        return highlightData.find(
            highlight => highlight.paragraph === paragraphIndex && highlight.sentence === sentenceIndex
        );
    };

    const getBubblesForSentence = (paragraphIndex: number, sentenceIndex: number) => {
        return bubbleData.filter(
            bubble => bubble.paragraph === paragraphIndex && bubble.sentence === sentenceIndex
        );
    };

    const renderParagraph = (paragraph: string, paragraphIndex: number) => {
        const sentences = splitIntoSentences(paragraph);

        return (
            <View key={paragraphIndex} style={styles.paragraph}>
                <Text style={styles.paragraphText}>
                    {sentences.map((sentence, sentenceIndex) => {
                        const highlight = getHighlightForSentence(paragraphIndex, sentenceIndex);
                        const bubbles = getBubblesForSentence(paragraphIndex, sentenceIndex);

                        return (
                            <Text key={sentenceIndex}>
                                <Text style={[
                                    styles.normalSentence,
                                    highlight ? getHighlightStyle(highlight.type) : null
                                ]}>
                                    {sentence}
                                    {sentenceIndex < sentences.length - 1 ? ' ' : ''}
                                </Text>

                                {/* 하이라이트된 문장이면 그 뒤에, 아니면 문장 끝에 말풍선 렌더링 */}
                                {bubbles.map((bubble) => {
                                    // 말풍선에 해당 문장 정보 추가
                                    const bubbleWithSentence = {
                                        ...bubble,
                                        sentence: sentence.trim(), // 해당 문장 내용 추가
                                        isHighlighted: !!highlight // 하이라이트 여부 추가
                                    };

                                    return (
                                        <Text key={bubble.id} style={styles.inlineBubbleContainer}>
                                            <TouchableOpacity
                                                style={[
                                                    styles.inlineBubble,
                                                    getBubbleStyle(bubble.type),
                                                    bubble.answer ? styles.answeredBubble : null
                                                ]}
                                                onPress={() => handleBubblePress(bubbleWithSentence)}
                                            >
                                                <Icon
                                                    name={bubble.type === 'question' ? 'help' :
                                                        bubble.type === 'note' ? 'note' : 'psychology'}
                                                    size={14}
                                                    color="white"
                                                />
                                            </TouchableOpacity>
                                        </Text>
                                    );
                                })}
                            </Text>
                        );
                    })}
                </Text>

                {/* 하이라이트 정보 표시 */}
                {sentences.some((_, sentenceIndex) =>
                    getHighlightForSentence(paragraphIndex, sentenceIndex)
                ) && (
                        <View style={styles.highlightInfo}>
                            {sentences.map((_, sentenceIndex) => {
                                const highlight = getHighlightForSentence(paragraphIndex, sentenceIndex);
                                return highlight ? (
                                    <Text key={sentenceIndex} style={styles.highlightNote}>
                                        📍 {highlight.note}
                                    </Text>
                                ) : null;
                            })}
                        </View>
                    )}
            </View>
        );
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>동적 말풍선 텍스트</Text>

            <View style={styles.controlButtons}>
                <Button title="말풍선 추가" onPress={addBubble} />
            </View>

            <Text style={styles.subtitle}>
                현재 하이라이트: {highlightData.length}개 | 말풍선: {bubbleData.length}개
            </Text>

            {textData.map((paragraph, index) => renderParagraph(paragraph, index))}

            {/* 질문/답변 모달 */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={handleCancel}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>
                            {selectedBubble?.type === 'question' ? '💭 질문' :
                                selectedBubble?.type === 'note' ? '📝 노트' : '🤔 생각해보기'}
                        </Text>

                        {/* 해당 문장 표시 */}
                        <View style={styles.sentenceContainer}>
                            <Text style={styles.sentenceLabel}>관련 문장:</Text>
                            <Text style={[
                                styles.sentenceText,
                                selectedBubble?.isHighlighted ? styles.highlightedSentenceText : null
                            ]}>
                                "{selectedBubble?.sentence}"
                            </Text>
                        </View>

                        <View style={styles.questionContainer}>
                            <Text style={styles.questionLabel}>내용:</Text>
                            <Text style={styles.questionText}>
                                {selectedBubble?.question}
                            </Text>
                        </View>

                        <View style={styles.answerContainer}>
                            <Text style={styles.answerLabel}>답변:</Text>
                            <TextInput
                                style={styles.answerInput}
                                placeholder="여기에 답변을 입력해주세요..."
                                placeholderTextColor="#999"
                                value={tempAnswer}
                                onChangeText={setTempAnswer}
                                multiline={true}
                                textAlignVertical="top"
                            />
                        </View>

                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                style={[styles.button, styles.cancelButton]}
                                onPress={handleCancel}
                            >
                                <Text style={styles.cancelButtonText}>취소</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.button, styles.saveButton]}
                                onPress={handleSaveAnswer}
                            >
                                <Text style={styles.saveButtonText}>저장</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    controlButtons: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 20,
        textAlign: 'center',
    },
    paragraph: {
        marginBottom: 20,
        padding: 10,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
    },
    paragraphText: {
        fontSize: 16,
        lineHeight: 24,
    },
    sentenceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    normalSentence: {
        color: '#000',
        flex: 1,
    },
    bubbleContainer: {
        flexDirection: 'row',
        marginLeft: 8,
        alignItems: 'center',
    },
    bubble: {
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 4,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    questionBubble: {
        backgroundColor: '#2196F3',
    },
    noteBubble: {
        backgroundColor: '#FF9800',
    },
    reflectionBubble: {
        backgroundColor: '#9C27B0',
    },
    answeredBubble: {
        backgroundColor: '#4CAF50',
    },
    importantHighlight: {
        backgroundColor: '#ffeb3b',
        color: '#000',
        paddingHorizontal: 4,
        paddingVertical: 2,
        fontWeight: 'bold',
    },
    warningHighlight: {
        backgroundColor: '#ffcdd2',
        color: '#d32f2f',
        paddingHorizontal: 4,
        paddingVertical: 2,
        fontWeight: 'bold',
    },
    exampleHighlight: {
        backgroundColor: '#c8e6c9',
        color: '#2e7d32',
        paddingHorizontal: 4,
        paddingVertical: 2,
        fontWeight: 'bold',
    },
    defaultHighlight: {
        backgroundColor: '#e1f5fe',
        color: '#0277bd',
        paddingHorizontal: 4,
        paddingVertical: 2,
        fontWeight: 'bold',
    },
    highlightInfo: {
        marginTop: 8,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    highlightNote: {
        fontSize: 12,
        color: '#666',
        fontStyle: 'italic',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        backgroundColor: 'white',
        width: width * 0.9,
        maxHeight: height * 0.7,
        borderRadius: 12,
        padding: 20,
        elevation: 10,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 24,
        color: '#333',
    },
    questionContainer: {
        marginBottom: 24,
    },
    questionLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#555',
        marginBottom: 8,
    },
    questionText: {
        fontSize: 16,
        color: '#333',
        backgroundColor: '#f8f8f8',
        padding: 12,
        borderRadius: 8,
        lineHeight: 22,
    },
    answerContainer: {
        marginBottom: 24,
    },
    answerLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#555',
        marginBottom: 8,
    },
    answerInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: '#333',
        minHeight: 120,
        backgroundColor: 'white',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        flex: 0.48,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#f0f0f0',
        borderWidth: 1,
        borderColor: '#ddd',
    },
    saveButton: {
        backgroundColor: '#4CAF50',
    },
    cancelButtonText: {
        fontSize: 16,
        color: '#666',
        fontWeight: '500',
    },
    saveButtonText: {
        fontSize: 16,
        color: 'white',
        fontWeight: '500',
    },
    inlineBubbleContainer: {
        // Text 컴포넌트 내에서 사용할 수 있도록 빈 스타일
    },
    inlineBubble: {
        width: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 4,
    },
    sentenceContainer: {
        marginBottom: 16,
        padding: 12,
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        borderLeftWidth: 4,
        borderLeftColor: '#007bff',
    },
    sentenceLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#495057',
        marginBottom: 6,
    },
    sentenceText: {
        fontSize: 15,
        color: '#212529',
        lineHeight: 22,
        fontStyle: 'italic',
    },
    highlightedSentenceText: {
        backgroundColor: '#fff3cd',
        paddingHorizontal: 6,
        paddingVertical: 3,
        borderRadius: 4,
        fontWeight: '600',
        color: '#856404',
    },
});

export default TextHighlight;
