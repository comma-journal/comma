// styles/WriteStyles.js
import { StyleSheet } from 'react-native';
import customFont from './fonts';

export const writeStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
    headerTitle: {
        fontSize: 26,
        color: '#333333',
        fontFamily: customFont,
    },
    writeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FB644C',
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 20,
    },
    writeButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        marginLeft: 6,
        fontFamily: customFont,
    },
    diaryList: {
        flex: 1,
        paddingHorizontal: 20,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 100,
    },
    emptyTitle: {
        fontSize: 20,
        color: '#666666',
        marginTop: 20,
        marginBottom: 8,
        fontFamily: customFont,
    },
    emptySubtitle: {
        fontSize: 16,
        color: '#999999',
        marginBottom: 30,
        fontFamily: customFont,
    },
    emptyWriteButton: {
        backgroundColor: '#FB644C',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 25,
    },
    emptyWriteButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontFamily: customFont,
    },
    diaryItem: {
        backgroundColor: '#FAFAFA',
        borderRadius: 12,
        padding: 16,
        marginVertical: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    diaryItemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    diaryDate: {
        fontSize: 22,
        color: '#FB644C',
        fontFamily: customFont,
    },
    diaryActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    emotionBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FB644C',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
        marginRight: 8,
    },
    emotionBadgeText: {
        color: '#FFFFFF',
        fontSize: 13,
        marginLeft: 4,
        fontFamily: customFont,
    },
    actionButton: {
        padding: 8,
        marginLeft: 4,
    },
    diaryTitle: {
        fontSize: 20,
        color: '#333333',
        marginBottom: 8,
        fontFamily: customFont,
    },
    diaryPreview: {
        fontSize: 16,
        color: '#666666',
        lineHeight: 20,
        fontFamily: customFont,
    },
});
