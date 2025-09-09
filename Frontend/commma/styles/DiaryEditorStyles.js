// styles/DiaryEditorStyles.js
import { StyleSheet } from 'react-native';
import customFont from './fonts';

export const diaryEditorStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    keyboardAvoidingView: {
        flex: 1,
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
    nextButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FB644C',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
    },
    nextButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        marginRight: 6,
        fontFamily: customFont,
    },
    dateContainer: {
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    dateText: {
        fontSize: 26,
        color: '#FB644C',
        fontFamily: customFont,
    },
    titleContainer: {
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    titleInput: {
        fontSize: 22,
        color: '#333333',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        fontFamily: customFont,
    },
    contentContainer: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
    },
    contentInput: {
        flex: 1,
        fontSize: 18,
        lineHeight: 24,
        color: '#333333',
        textAlignVertical: 'top',
        minHeight: 300,
        paddingVertical: 0,
        fontFamily: customFont,
    },
});
