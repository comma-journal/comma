// styles/EmotionGridStyles.js
import { StyleSheet } from 'react-native';

export const emotionGridStyles = StyleSheet.create({
    emotionGrid: {
        flex: 1,
        marginBottom: 16,
    },
    emotionGridContent: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingBottom: 20,
    },
    emotionCard: {
        borderRadius: 12,
        margin: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 3,
    },
    emotionCardTouchArea: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
        position: 'relative',
    },
    emotionCardText: {
        color: '#FFFFFF',
        textAlign: 'center',
        fontWeight: '800',
        textShadowColor: 'rgba(0,0,0,0.3)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    selectedBadge: {
        position: 'absolute',
        top: -6,
        right: -6,
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
    },
    selectedBadgeText: {
        color: '#4CAF50',
        fontSize: 12,
        fontWeight: '700',
    },
});
