// styles/TextSelectorStyles.js
import { StyleSheet } from 'react-native';
import customFont from './fonts';

export const textSelectorStyles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingTop: 15,
    },
    hybridContainer: {
        position: 'relative',
        minHeight: 200,
        flex: 1,
    },
    hybridInput: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 2,
        fontSize: 20,
        lineHeight: 24,
        textAlignVertical: 'top',
        backgroundColor: 'transparent',
        paddingHorizontal: 0,
        paddingVertical: 0,
        margin: 0,
        fontFamily: customFont,
    },
    styledOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1,
        backgroundColor: 'transparent',
        pointerEvents: 'none',
        paddingHorizontal: 0,
        paddingVertical: 0,
        margin: 0,
    },
    styledText: {
        fontSize: 20,
        lineHeight: 24,
        color: '#333333',
        paddingHorizontal: 0,
        paddingVertical: 0,
        margin: 0,
        fontFamily: customFont,
    },
});
