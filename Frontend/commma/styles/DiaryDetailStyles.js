// styles/DiaryDetailStyles.js
import { StyleSheet } from 'react-native';

export const diaryDetailStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    backButton: {
        padding: 10,
    },
    editButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E57373',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
    },
    editButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 6,
    },
    scrollView: {
        flex: 1,
        paddingHorizontal: 20,
    },
    dateContainer: {
        paddingVertical: 20,
    },
    dateText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#E57373',
    },
    updatedText: {
        fontSize: 12,
        color: '#999999',
        marginTop: 4,
    },
    titleContainer: {
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    title: {
        fontSize: 22,
        fontWeight: '600',
        color: '#333333',
    },
    contentContainer: {
        paddingVertical: 20,
    },
    contentText: {
        fontSize: 16,
        lineHeight: 24,
        color: '#333333',
    },
    emotionStats: {
        marginTop: 20,
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    emotionStatsTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333333',
        marginBottom: 16,
    },
    emotionItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 12,
        backgroundColor: '#FAFAFA',
        padding: 12,
        borderRadius: 8,
    },
    emotionIndicator: {
        borderRadius: 16,
        paddingHorizontal: 10,
        paddingVertical: 6,
        marginRight: 12,
        minWidth: 60,
        alignItems: 'center',
    },
    emotionIndicatorText: {
        color: '#FFFFFF',
        fontSize: 11,
        fontWeight: '700',
        textShadowColor: 'rgba(0,0,0,0.3)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 1,
    },
    emotionText: {
        flex: 1,
        fontSize: 14,
        color: '#333333',
        lineHeight: 20,
    },
});
