// src/components/Editor.js
import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
    KeyboardAvoidingView,
    Platform,
    StatusBar,
    Modal,
} from 'react-native';

const Editor = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [wordCount, setWordCount] = useState(0);
    const [charCount, setCharCount] = useState(0);
    const [baseFontSize, setBaseFontSize] = useState(16);
    const [selectionStart, setSelectionStart] = useState(0);
    const [selectionEnd, setSelectionEnd] = useState(0);
    const [textFormats, setTextFormats] = useState([]);
    const [showFormatted, setShowFormatted] = useState(false);
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [colorType, setColorType] = useState('text');
    const contentInputRef = useRef(null);

    // 흑백 회색 색상 팔레트
    const colors = [
        '#000000', '#1A202C', '#2D3748', '#4A5568', '#718096', '#A0AEC0',
        '#CBD5E0', '#E2E8F0', '#EDF2F7', '#F7FAFC', '#FFFFFF', '#FAFAFA',
        '#F5F5F5', '#EEEEEE', '#E0E0E0', '#BDBDBD', '#9E9E9E', '#757575',
        '#616161', '#424242', '#303030', '#212121', '#141414', '#0A0A0A',
    ];

    // 글자 수 계산
    useEffect(() => {
        setCharCount(content.length);
        setWordCount(content.trim().split(/\s+/).filter(word => word.length > 0).length);
    }, [content]);

    // 현재 선택된 텍스트의 서식 상태 확인
    const getCurrentFormat = () => {
        if (selectionStart === selectionEnd) return { bold: false, italic: false, underline: false, strikethrough: false };
        
        const selectedFormats = textFormats.filter(format => 
            format.start < selectionEnd && format.end > selectionStart
        );
        
        return {
            bold: selectedFormats.some(format => format.bold),
            italic: selectedFormats.some(format => format.italic),
            underline: selectedFormats.some(format => format.underline),
            strikethrough: selectedFormats.some(format => format.strikethrough),
            fontSize: selectedFormats.find(format => format.fontSize)?.fontSize,
            color: selectedFormats.find(format => format.color)?.color,
            backgroundColor: selectedFormats.find(format => format.backgroundColor)?.backgroundColor,
        };
    };

    // 서식 적용/제거 공통 함수
    const applyFormat = (formatType, value = true) => {
        if (selectionStart === selectionEnd) {
            Alert.alert('알림', '서식을 적용할 텍스트를 선택해주세요.');
            return;
        }

        const currentFormat = getCurrentFormat();
        let newFormats = [...textFormats];
        
        // 기존 서식 분할 처리
        newFormats = newFormats.filter(format => 
            !(format.start < selectionEnd && format.end > selectionStart)
        );

        textFormats.forEach(format => {
            if (format.start < selectionEnd && format.end > selectionStart) {
                // 선택 범위 이전 부분
                if (format.start < selectionStart) {
                    newFormats.push({
                        start: format.start,
                        end: selectionStart,
                        ...format
                    });
                }
                
                // 선택 범위 이후 부분
                if (format.end > selectionEnd) {
                    newFormats.push({
                        start: selectionEnd,
                        end: format.end,
                        ...format
                    });
                }
            }
        });

        // 새로운 서식 적용
        const shouldApply = formatType === 'bold' ? !currentFormat.bold :
                          formatType === 'italic' ? !currentFormat.italic :
                          formatType === 'underline' ? !currentFormat.underline :
                          formatType === 'strikethrough' ? !currentFormat.strikethrough :
                          true;

        if (shouldApply) {
            const newFormat = {
                start: selectionStart,
                end: selectionEnd,
                ...currentFormat,
                [formatType]: value
            };
            
            // 불필요한 기본값 제거
            if (!newFormat.bold) delete newFormat.bold;
            if (!newFormat.italic) delete newFormat.italic;
            if (!newFormat.underline) delete newFormat.underline;
            if (!newFormat.strikethrough) delete newFormat.strikethrough;
            
            newFormats.push(newFormat);
        }

        setTextFormats(newFormats);
        showFormattedPreview();
    };

    // 개별 서식 적용 함수들
    const toggleBold = () => applyFormat('bold');
    const toggleItalic = () => applyFormat('italic');
    const toggleUnderline = () => applyFormat('underline');
    const toggleStrikethrough = () => applyFormat('strikethrough');

    // 글자 크기 적용 - 리치 텍스트 방식으로 변경
    const applyFontSize = (size) => {
        applyFormat('fontSize', size);
    };

    // 색상 적용
    const applyColor = (color) => {
        if (colorType === 'text') {
            applyFormat('color', color);
        } else {
            applyFormat('backgroundColor', color);
        }
        setShowColorPicker(false);
    };

    // 서식 적용 후 잠시 결과를 보여주는 함수
    const showFormattedPreview = () => {
        setShowFormatted(true);
        setTimeout(() => {
            setShowFormatted(false);
            contentInputRef.current?.focus();
        }, 1000);
    };

    // 텍스트 선택 변경 핸들러
    const handleSelectionChange = (event) => {
        setSelectionStart(event.nativeEvent.selection.start);
        setSelectionEnd(event.nativeEvent.selection.end);
    };

    // 텍스트 변경 핸들러
    const handleContentChange = (newContent) => {
        const lengthDiff = newContent.length - content.length;
        
        if (lengthDiff !== 0) {
            const adjustedFormats = textFormats.map(format => {
                if (format.start >= selectionStart) {
                    return {
                        ...format,
                        start: Math.max(0, format.start + lengthDiff),
                        end: Math.max(0, format.end + lengthDiff)
                    };
                }
                return format;
            }).filter(format => format.end > format.start && format.end <= newContent.length);
            
            setTextFormats(adjustedFormats);
        }
        
        setContent(newContent);
    };

    // 서식이 적용된 텍스트 렌더링
    const renderFormattedText = () => {
        if (!content) {
            return (
                <Text style={[styles.contentFormatted, { fontSize: baseFontSize, color: '#718096' }]}>
                    내용을 입력하세요...
                </Text>
            );
        }

        const parts = [];
        let lastIndex = 0;

        const sortedFormats = [...textFormats].sort((a, b) => a.start - b.start);

        sortedFormats.forEach((format, index) => {
            if (lastIndex < format.start) {
                parts.push(
                    <Text key={`normal-${index}-${lastIndex}`} style={{ fontSize: baseFontSize }}>
                        {content.substring(lastIndex, format.start)}
                    </Text>
                );
            }

            const formatStyle = {
                fontSize: format.fontSize || baseFontSize,
                fontWeight: format.bold ? 'bold' : 'normal',
                fontStyle: format.italic ? 'italic' : 'normal',
                textDecorationLine: [
                    format.underline && 'underline',
                    format.strikethrough && 'line-through'
                ].filter(Boolean).join(' ') || 'none',
                color: format.color || '#2D3748',
                backgroundColor: format.backgroundColor || 'transparent',
            };

            parts.push(
                <Text key={`formatted-${index}`} style={formatStyle}>
                    {content.substring(format.start, format.end)}
                </Text>
            );

            lastIndex = format.end;
        });

        if (lastIndex < content.length) {
            parts.push(
                <Text key={`final-${lastIndex}`} style={{ fontSize: baseFontSize }}>
                    {content.substring(lastIndex)}
                </Text>
            );
        }

        return <Text style={styles.contentFormatted}>{parts}</Text>;
    };

    // 모든 서식 제거
    const clearAllFormats = () => {
        Alert.alert(
            '서식 초기화',
            '모든 서식을 제거하시겠습니까?',
            [
                { text: '취소', style: 'cancel' },
                {
                    text: '확인',
                    onPress: () => {
                        setTextFormats([]);
                        setShowFormatted(false);
                    },
                },
            ],
        );
    };

    // 저장 함수
    const handleSave = () => {
        if (!title.trim() && !content.trim()) {
            Alert.alert('알림', '제목이나 내용을 입력해주세요.');
            return;
        }

        const note = {
            id: Date.now().toString(),
            title: title.trim() || '제목 없음',
            content: content,
            formats: textFormats,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        console.log('Note saved:', note);
        Alert.alert('성공', '노트가 저장되었습니다.');
    };

    // 초기화 함수
    const handleClear = () => {
        Alert.alert(
            '확인',
            '모든 내용을 지우시겠습니까?',
            [
                { text: '취소', style: 'cancel' },
                {
                    text: '확인',
                    style: 'destructive',
                    onPress: () => {
                        setTitle('');
                        setContent('');
                        setTextFormats([]);
                        setSelectionStart(0);
                        setSelectionEnd(0);
                        setShowFormatted(false);
                    },
                },
            ],
        );
    };

    // 기본 폰트 크기 조절
    const adjustBaseFontSize = (delta) => {
        const newSize = baseFontSize + delta;
        if (newSize >= 12 && newSize <= 32) {
            setBaseFontSize(newSize);
        }
    };

    const currentFormat = getCurrentFormat();

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <StatusBar backgroundColor="#2D3748" barStyle="light-content" />

            {/* 헤더 */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>텍스트 에디터</Text>
                <View style={styles.headerButtons}>
                    <TouchableOpacity 
                        onPress={() => setShowFormatted(!showFormatted)}
                        style={[styles.headerButton, showFormatted && styles.activeHeaderButton]}
                    >
                        <Text style={styles.headerButtonText}>View</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={clearAllFormats} style={styles.headerButton}>
                        <Text style={styles.headerButtonText}>Clear</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleClear} style={styles.headerButton}>
                        <Text style={styles.headerButtonText}>Reset</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleSave} style={styles.headerButton}>
                        <Text style={styles.headerButtonText}>Save</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* 2줄 툴바 */}
            <View style={styles.toolbar}>
                {/* 첫 번째 줄: 기본 서식 */}
                <View style={styles.toolbarRow}>
                    <TouchableOpacity
                        style={[styles.toolButton, currentFormat.bold && styles.activeToolButton]}
                        onPress={toggleBold}
                    >
                        <Text style={[styles.toolButtonText, { fontWeight: 'bold' }]}>B</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.toolButton, currentFormat.italic && styles.activeToolButton]}
                        onPress={toggleItalic}
                    >
                        <Text style={[styles.toolButtonText, { fontStyle: 'italic' }]}>I</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.toolButton, currentFormat.underline && styles.activeToolButton]}
                        onPress={toggleUnderline}
                    >
                        <Text style={[styles.toolButtonText, { textDecorationLine: 'underline' }]}>U</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.toolButton, currentFormat.strikethrough && styles.activeToolButton]}
                        onPress={toggleStrikethrough}
                    >
                        <Text style={[styles.toolButtonText, { textDecorationLine: 'line-through' }]}>S</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.toolButton}
                        onPress={() => {
                            setColorType('text');
                            setShowColorPicker(true);
                        }}
                    >
                        <View style={styles.colorButtonContainer}>
                            <Text style={styles.toolButtonText}>A</Text>
                            <View style={[styles.colorIndicator, { backgroundColor: currentFormat.color || '#2D3748' }]} />
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.toolButton, { backgroundColor: '#E2E8F0' }]}
                        onPress={() => {
                            setColorType('background');
                            setShowColorPicker(true);
                        }}
                    >
                        <View style={styles.colorButtonContainer}>
                            <Text style={[styles.toolButtonText, { color: '#2D3748' }]}>A</Text>
                            <View style={[styles.colorIndicator, { backgroundColor: currentFormat.backgroundColor || '#FFFFFF', borderWidth: 1, borderColor: '#A0AEC0' }]} />
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.toolButton}
                        onPress={() => adjustBaseFontSize(-2)}
                    >
                        <Text style={styles.toolButtonText}>A-</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.toolButton}
                        onPress={() => adjustBaseFontSize(2)}
                    >
                        <Text style={styles.toolButtonText}>A+</Text>
                    </TouchableOpacity>
                </View>

                {/* 두 번째 줄: 글자 크기 */}
                <View style={styles.toolbarRow}>
                    <Text style={styles.toolbarLabel}>크기:</Text>
                    {[12, 14, 16, 18, 20, 24, 28, 32].map(size => (
                        <TouchableOpacity
                            key={size}
                            style={[styles.toolButton, currentFormat.fontSize === size && styles.activeToolButton]}
                            onPress={() => applyFontSize(size)}
                        >
                            <Text style={styles.toolButtonText}>{size}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* 제목 입력 */}
                <TextInput
                    style={styles.titleInput}
                    placeholder="제목을 입력하세요..."
                    placeholderTextColor="#A0AEC0"
                    value={title}
                    onChangeText={setTitle}
                    maxLength={100}
                    returnKeyType="next"
                    onSubmitEditing={() => contentInputRef.current?.focus()}
                />

                {/* 내용 영역 */}
                <View style={styles.contentContainer}>
                    <TextInput
                        ref={contentInputRef}
                        style={[
                            styles.contentInput, 
                            { 
                                fontSize: baseFontSize,
                                opacity: showFormatted ? 0 : 1,
                            }
                        ]}
                        placeholder={showFormatted ? "" : "내용을 입력하세요..."}
                        placeholderTextColor="#A0AEC0"
                        value={content}
                        onChangeText={handleContentChange}
                        onSelectionChange={handleSelectionChange}
                        multiline
                        textAlignVertical="top"
                        scrollEnabled={false}
                    />

                    {showFormatted && (
                        <View style={styles.formattedOverlay}>
                            {renderFormattedText()}
                        </View>
                    )}
                </View>
            </ScrollView>

            {/* 색상 선택 모달 */}
            <Modal
                visible={showColorPicker}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowColorPicker(false)}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.colorPickerModal}>
                        <Text style={styles.modalTitle}>
                            {colorType === 'text' ? '글자 색상 선택' : '배경 색상 선택'}
                        </Text>
                        
                        <View style={styles.colorGrid}>
                            {colors.map(color => (
                                <TouchableOpacity
                                    key={color}
                                    style={[styles.colorSwatch, { backgroundColor: color }]}
                                    onPress={() => applyColor(color)}
                                >
                                    {(color === '#FFFFFF' || color === '#FAFAFA' || color === '#F7FAFC') && <View style={styles.whiteBorder} />}
                                </TouchableOpacity>
                            ))}
                        </View>

                        <TouchableOpacity
                            style={styles.modalCloseButton}
                            onPress={() => setShowColorPicker(false)}
                        >
                            <Text style={styles.modalCloseButtonText}>닫기</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* 하단 상태바 */}
            <View style={styles.statusBar}>
                <Text style={styles.statusText}>
                    글자: {charCount} | 단어: {wordCount}
                </Text>
                <Text style={styles.statusText}>
                    {selectionStart !== selectionEnd && `선택: ${selectionEnd - selectionStart}자`}
                </Text>
                <Text style={styles.statusText}>
                    서식: {textFormats.length}개 | 기본 크기: {baseFontSize}px
                </Text>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        backgroundColor: '#2D3748',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    headerButtons: {
        flexDirection: 'row',
        gap: 8,
    },
    headerButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderRadius: 6,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    activeHeaderButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    headerButtonText: {
        fontSize: 12,
        color: '#FFFFFF',
        fontWeight: '500',
    },

    // 2줄 툴바
    toolbar: {
        backgroundColor: '#F7FAFC',
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        paddingVertical: 8,
    },
    toolbarRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 4,
        flexWrap: 'wrap',
    },
    toolbarLabel: {
        fontSize: 12,
        color: '#4A5568',
        fontWeight: '500',
        marginRight: 8,
    },
    toolButton: {
        minWidth: 42,
        height: 42,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 8,
        marginHorizontal: 3,
        marginVertical: 2,
        borderRadius: 8,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    activeToolButton: {
        backgroundColor: '#2D3748',
        borderColor: '#1A202C',
    },
    toolButtonText: {
        fontSize: 16,
        color: '#2D3748',
        fontWeight: '600',
    },
    colorButtonContainer: {
        alignItems: 'center',
    },
    colorIndicator: {
        width: 20,
        height: 4,
        marginTop: 2,
        borderRadius: 2,
    },

    scrollView: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    titleInput: {
        fontSize: 22,
        fontWeight: '600',
        color: '#2D3748',
        padding: 16,
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
    },
    contentContainer: {
        position: 'relative',
        minHeight: 400,
    },
    contentInput: {
        color: '#2D3748',
        padding: 16,
        minHeight: 400,
        lineHeight: 24,
    },
    contentFormatted: {
        color: '#2D3748',
        lineHeight: 24,
        minHeight: 20,
    },
    formattedOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        padding: 16,
        minHeight: 400,
        backgroundColor: 'rgba(255, 255, 255, 0.98)',
    },

    // 모달 스타일
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    colorPickerModal: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 20,
        margin: 20,
        maxWidth: 320,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    modalTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2D3748',
        textAlign: 'center',
        marginBottom: 16,
    },
    colorGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 8,
        marginBottom: 20,
    },
    colorSwatch: {
        width: 36,
        height: 36,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    whiteBorder: {
        position: 'absolute',
        top: -1,
        left: -1,
        right: -1,
        bottom: -1,
        borderWidth: 1,
        borderColor: '#A0AEC0',
        borderRadius: 8,
    },
    modalCloseButton: {
        backgroundColor: '#2D3748',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        alignSelf: 'center',
    },
    modalCloseButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },

    statusBar: {
        backgroundColor: '#2D3748',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    statusText: {
        fontSize: 11,
        color: '#FFFFFF',
        fontWeight: '400',
    },
});

export default Editor;
