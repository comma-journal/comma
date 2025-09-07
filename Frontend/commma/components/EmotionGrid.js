// components/EmotionGrid.js
import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Animated,
    Dimensions,
} from 'react-native';
import { emotions } from '../data/emotionsData';
import { emotionGridStyles } from '../styles/components/EmotionGridStyles';

const { width } = Dimensions.get('window');

const EmotionGrid = ({ 
    selectedEmotion, 
    onEmotionSelect, 
    cardAnimations 
}) => {
    // 감정 카드 렌더링
    const renderEmotionCard = (emotion, index) => {
        const cardWidth = width / 5 - 14;
        const cardHeight = 66;

        return (
            <Animated.View
                key={emotion.id}
                style={[
                    emotionGridStyles.emotionCard,
                    {
                        width: cardWidth,
                        height: cardHeight,
                        backgroundColor: emotion.color,
                        transform: [
                            { translateY: cardAnimations[index].translateY },
                            { scale: cardAnimations[index].scale },
                        ],
                    },
                ]}
            >
                <TouchableOpacity
                    style={emotionGridStyles.emotionCardTouchArea}
                    activeOpacity={0.9}
                    onPress={() => onEmotionSelect(emotion)}
                >
                    <Text style={[
                        emotionGridStyles.emotionCardText,
                        {
                            fontSize: selectedEmotion?.id === emotion.id ? 14 : 11,
                            fontWeight: selectedEmotion?.id === emotion.id ? '900' : '800',
                        }
                    ]}>
                        {emotion.name}
                    </Text>
                    {selectedEmotion?.id === emotion.id && (
                        <View style={emotionGridStyles.selectedBadge}>
                            <Text style={emotionGridStyles.selectedBadgeText}>✓</Text>
                        </View>
                    )}
                </TouchableOpacity>
            </Animated.View>
        );
    };

    return (
        <ScrollView
            style={emotionGridStyles.emotionGrid}
            showsVerticalScrollIndicator={false}
        >
            <View style={emotionGridStyles.emotionGridContent}>
                {emotions.map(renderEmotionCard)}
            </View>
        </ScrollView>
    );
};

export default EmotionGrid;
