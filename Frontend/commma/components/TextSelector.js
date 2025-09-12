// components/TextSelector.js
import React, { useRef, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    ScrollView,
} from 'react-native';
import { textSelectorStyles } from '../styles/TextSelectorStyles';

const TextSelector = ({ 
    savedContent, 
    emotionSegments, 
    onSelectionChangeCallBack, 
    onContentChange,
    onEditEmotion,
    customRenderer
}) => {
    const [content, setContent] = useState(savedContent);

    // content 변경 처리 (비동기 처리 지원)
    const handleContentChange = async (text) => {
        if (onContentChange) {
            const shouldUpdate = await onContentChange(text);
            if (shouldUpdate !== false) {
                setContent(text);
            }
        } else {
            setContent(text);
        }
    };

    // 스타일된 텍스트 렌더링
    const renderStyledText = (content) => {
        // customRenderer가 있으면 우선 사용
        if (customRenderer) {
            return customRenderer();
        }

        // 기존 렌더링 로직
        if (!content || content.length === 0) {
            return null;
        }
        

        if (emotionSegments.length === 0) {
            return (
                <Text style={textSelectorStyles.styledText}>
                    {content}
                </Text>
            );
        }

        const sortedSegments = [...emotionSegments].sort((a, b) => a.start - b.start);
        const charEmotions = new Array(content.length).fill(null);
        
        sortedSegments.forEach(segment => {
            for (let i = segment.start; i < segment.end; i++) {
                if (i < content.length) {
                    charEmotions[i] = segment;
                }
            }
        });

        const elements = [];
        let currentIndex = 0;

        while (currentIndex < content.length) {
            const currentEmotion = charEmotions[currentIndex];
            let endIndex = currentIndex;

            while (endIndex < content.length && charEmotions[endIndex] === currentEmotion) {
                endIndex++;
            }

            const textSegment = content.slice(currentIndex, endIndex);
            const isEmotion = currentEmotion !== null;

            if (isEmotion) {
                elements.push(
                    <Text
                        key={`emotion-${currentIndex}`}
                        style={[
                            textSelectorStyles.styledText,
                            {
                                backgroundColor: currentEmotion.emotionColor + '40',
                                borderRadius: 2,
                            }
                        ]}
                        onPress={() => onEditEmotion(currentEmotion)}
                    >
                        {textSegment}
                    </Text>
                );
            } else {
                elements.push(
                    <Text key={`normal-${currentIndex}`} style={textSelectorStyles.styledText}>
                        {textSegment}
                    </Text>
                );
            }

            currentIndex = endIndex;
        }

        return (
            <Text style={textSelectorStyles.styledText}>
                {elements}
            </Text>
        );
    };

    return (
        <View style={textSelectorStyles.container}>
            <ScrollView 
                style={textSelectorStyles.scrollView} 
                contentContainerStyle={textSelectorStyles.scrollContent}
            >
                <View style={textSelectorStyles.hybridContainer}>
                    {/* 감정 표시용 오버레이 */}
                    <View style={textSelectorStyles.styledOverlay}>
                        {renderStyledText(content)}
                    </View>
                    
                    {/* 투명한 TextInput - 실제 입력 처리 */}
                    <TextInput
                        style={[
                            textSelectorStyles.hybridInput,
                            {color: 'transparent'}
                        ]}
                        multiline
                        defaultValue={savedContent}
                        onSelectionChange={(event) => {
                            onSelectionChangeCallBack({
                                start: event.nativeEvent.selection.start, 
                                end: event.nativeEvent.selection.end, 
                                content: content
                            });
                        }}
                        onChangeText={handleContentChange}
                        textAlignVertical="top"
                        selectionColor="#E57373"
                        scrollEnabled={false}
                        placeholder="여기에 일기를 작성해보세요..."
                        placeholderTextColor="#999999"
                    />
                </View>
            </ScrollView>
        </View>
    );
};

export default TextSelector;
