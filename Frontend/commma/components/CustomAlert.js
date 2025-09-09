// components/CustomAlert.js
import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    TouchableWithoutFeedback,
} from 'react-native';
import { StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import customFont from '../styles/fonts';

const CustomAlert = ({
    visible,
    title,
    message,
    buttons = [],
    onBackdropPress,
    type = 'default', // 'success', 'warning', 'error'
}) => {
    const getIconName = () => {
        switch (type) {
            case 'success': return 'check-circle';
            case 'warning': return 'warning';
            case 'error': return 'error';
            default: return 'info';
        }
    };

    const getIconColor = () => {
        switch (type) {
            case 'success': return '#4CAF50';
            case 'warning': return '#FF9800';
            case 'error': return '#F44336';
            default: return '#2196F3';
        }
    };

    // 버튼이 3개 이상이면 세로 배치, 2개 이하면 가로 배치
    const shouldUseVerticalLayout = buttons.length > 2;

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={() => {
                if (onBackdropPress) onBackdropPress();
            }}
        >
            <TouchableWithoutFeedback onPress={onBackdropPress}>
                <View style={styles.backdrop}>
                    <TouchableWithoutFeedback>
                        <View style={styles.alertContainer}>
                            {/* 아이콘 */}
                            <View style={styles.iconContainer}>
                                <Icon
                                    name={getIconName()}
                                    size={48}
                                    color={getIconColor()}
                                />
                            </View>

                            {/* 제목 */}
                            {title && (
                                <Text style={styles.title}>{title}</Text>
                            )}

                            {/* 메시지 */}
                            {message && (
                                <Text style={styles.message}>{message}</Text>
                            )}

                            {/* 버튼들 - 동적 레이아웃 */}
                            <View style={[
                                styles.buttonsContainer,
                                shouldUseVerticalLayout && styles.buttonsContainerVertical
                            ]}>
                                {buttons.map((button, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={[
                                            styles.button,
                                            button.style === 'cancel' && styles.cancelButton,
                                            button.style === 'destructive' && styles.destructiveButton,
                                            shouldUseVerticalLayout && styles.buttonVertical,
                                            buttons.length === 1 && styles.singleButton,
                                        ]}
                                        onPress={button.onPress}
                                    >
                                        <Text
                                            style={[
                                                styles.buttonText,
                                                button.style === 'cancel' && styles.cancelButtonText,
                                                button.style === 'destructive' && styles.destructiveButtonText,
                                            ]}
                                        >
                                            {button.text}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    alertContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 24,
        minWidth: 280,
        maxWidth: 340,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 12,
    },
    iconContainer: {
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333333',
        textAlign: 'center',
        marginBottom: 12,
        lineHeight: 24,
        fontFamily: customFont,
    },
    message: {
        fontSize: 16,
        color: '#666666',
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 22,
        fontFamily: customFont,
    },
    buttonsContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    buttonsContainerVertical: {
        flexDirection: 'column',
        gap: 8,
    },
    button: {
        flex: 1,
        backgroundColor: '#FB644C',
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 16,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 44,
    },
    buttonVertical: {
        flex: 0,
        width: '100%',
        paddingVertical: 14,
    },
    singleButton: {
        flex: 1,
    },
    cancelButton: {
        backgroundColor: '#F5F5F5',
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    destructiveButton: {
        backgroundColor: '#F44336',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
        fontFamily: customFont,
        textAlign: 'center',
    },
    cancelButtonText: {
        color: '#666666',
    },
    destructiveButtonText: {
        color: '#FFFFFF',
    },
});

export default CustomAlert;
