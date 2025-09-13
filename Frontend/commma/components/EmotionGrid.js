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
import { emotionGridStyles } from '../styles/components/EmotionGridStyles';

const { width } = Dimensions.get('window');

const EmotionGrid = ({
    selectedEmotion,
    onEmotionSelect,
    cardAnimations,
    emotions,
    showCategories,
    onCategorySelect,
    emotionCategories,
}) => {

    // 카테고리 카드 렌더링
    const renderCategoryCard = (category, index) => {
        const cardWidth = width / 2 - 30;
        const cardHeight = 100;

        return (
            <TouchableOpacity
                key={category.id}
                style={[
                    emotionGridStyles.categoryCard,
                    {
                        backgroundColor: category.color,
                    },
                ]}
                activeOpacity={0.8}
                onPress={() => onCategorySelect(category)}
            >
                <Text style={emotionGridStyles.categoryCardTitle}>
                    {category.name}
                </Text>
                <Text style={emotionGridStyles.categoryCardDescription}>
                    {category.description}
                </Text>
                <Text style={emotionGridStyles.categoryCardCount}>
                    {category.emotions.length}개
                </Text>
            </TouchableOpacity>
        );
    };

    // 감정 카드 렌더링
    const renderEmotionCard = (emotion, index) => {
        const cardWidth = width / 5 - 15;
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
                            { translateY: cardAnimations[index]?.translateY || new Animated.Value(0) },
                            { scale: cardAnimations[index]?.scale || new Animated.Value(1) },
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
                            fontSize: selectedEmotion?.id === emotion.id ? 13 : 10,
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
            {showCategories ? (
                <View style={emotionGridStyles.categoryGridContent}>
                    {emotionCategories?.map(renderCategoryCard) || []}
                </View>
            ) : (
                <View style={emotionGridStyles.emotionGridContent}>
                    {emotions?.map(renderEmotionCard) || []}
                </View>
            )}
        </ScrollView>
    );
};

export default EmotionGrid;
