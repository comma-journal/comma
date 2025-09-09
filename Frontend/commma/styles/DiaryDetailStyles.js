// styles/DiaryDetailStyles.js
import { StyleSheet } from 'react-native';
import customFont from './fonts';

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
        fontSize: 18,
        marginLeft: 6,
        fontFamily: customFont,
    },
    scrollView: {
        flex: 1,
        paddingHorizontal: 20,
    },
    dateContainer: {
        paddingVertical: 20,
    },
    dateText: {
        fontSize: 26,
        color: '#E57373',
        fontFamily: customFont,
    },
    updatedText: {
        fontSize: 14,
        color: '#999999',
        marginTop: 4,
        fontFamily: customFont,
    },
    titleContainer: {
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        color: '#333333',
        fontFamily: customFont,
    },
    contentContainer: {
        paddingVertical: 20,
    },
    contentText: {
        fontSize: 18,
        lineHeight: 24,
        color: '#333333',
        fontFamily: customFont,
    },
    emotionStats: {
        marginTop: 20,
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    emotionStatsTitle: {
        fontSize: 20,
        color: '#333333',
        marginBottom: 16,
        fontFamily: customFont,
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
        fontSize: 13,
        textShadowColor: 'rgba(0,0,0,0.3)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 1,
        fontFamily: customFont,
    },
    emotionText: {
        flex: 1,
        fontSize: 16,
        color: '#333333',
        lineHeight: 20,
        fontFamily: customFont,
    },
});
