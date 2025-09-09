// styles/EmotionModalStyles.js
import { StyleSheet, Dimensions } from 'react-native';
import customFont from '../fonts';

const { height } = Dimensions.get('window');

export const emotionModalStyles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingTop: 20,
        paddingHorizontal: 20,
        maxHeight: height * 0.8,
        minHeight: height * 0.6,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    modalTitle: {
        fontSize: 20,
        color: '#333333',
        fontFamily: customFont,
    },
    selectedTextContainer: {
        backgroundColor: '#F8F8F8',
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
    },
    selectedTextLabel: {
        fontSize: 14,
        color: '#666666',
        marginBottom: 4,
        fontFamily: customFont,
    },
    selectedTextDisplay: {
        fontSize: 18,
        color: '#333333',
        fontFamily: customFont,
    },
    selectedEmotionInfo: {
        alignItems: 'center',
        marginBottom: 16,
    },
    selectedEmotionPreview: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    selectedEmotionName: {
        color: '#FFFFFF',
        fontSize: 18,
        textShadowColor: 'rgba(0,0,0,0.3)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
        fontFamily: customFont,
    },
    modalButtons: {
        flexDirection: 'row',
        paddingBottom: 30,
    },
    cancelButton: {
        flex: 1,
        paddingVertical: 14,
        alignItems: 'center',
        backgroundColor: '#F0F0F0',
        borderRadius: 12,
        marginRight: 4,
    },
    cancelButtonText: {
        color: '#666666',
        fontSize: 18,
        fontFamily: customFont,
    },
    deleteButton: {
        flex: 1,
        paddingVertical: 14,
        alignItems: 'center',
        backgroundColor: '#FF6B6B',
        borderRadius: 12,
        marginHorizontal: 4,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    deleteButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        marginLeft: 4,
        fontFamily: customFont,
    },
    applyButton: {
        flex: 1,
        paddingVertical: 14,
        alignItems: 'center',
        backgroundColor: '#FB644C',
        borderRadius: 12,
        marginLeft: 4,
    },
    applyButtonDisabled: {
        backgroundColor: '#D0D0D0',
    },
    applyButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontFamily: customFont,
    },
});
