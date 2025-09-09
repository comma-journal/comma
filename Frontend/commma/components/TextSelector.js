// components/TextSelector.js
import React, { useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { textSelectorStyles } from '../styles/TextSelectorStyles';

const TextSelector = ({ 
    content, 
    emotionSegments, 
    onSelectionChange, 
    onEditEmotion 
}) => {
    const textInputRef = useRef(null);

    // 스타일된 텍스트 렌더링
    const renderStyledText = () => {
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
                    <View style={textSelectorStyles.styledOverlay}>
                        {renderStyledText()}
                    </View>
                    <TextInput
                        ref={textInputRef}
                        style={textSelectorStyles.hybridInput}
                        multiline
                        value={content}
                        onSelectionChange={onSelectionChange}
                        textAlignVertical="top"
                        selectionColor="#FB644C"
                        showSoftInputOnFocus={false}
                        scrollEnabled={false}
                    />
                </View>
            </ScrollView>
        </View>
    );
};

export default TextSelector;
