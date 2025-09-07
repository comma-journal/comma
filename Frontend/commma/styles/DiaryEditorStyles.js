// styles/DiaryEditorStyles.js
import { StyleSheet } from 'react-native';

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
        backgroundColor: '#E57373',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
    },
    nextButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
        marginRight: 6,
    },
    dateContainer: {
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    dateText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#E57373',
    },
    titleContainer: {
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    titleInput: {
        fontSize: 20,
        fontWeight: '600',
        color: '#333333',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
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
        fontSize: 16,
        lineHeight: 24,
        color: '#333333',
        textAlignVertical: 'top',
        minHeight: 300,
        paddingVertical: 0,
    },
});
