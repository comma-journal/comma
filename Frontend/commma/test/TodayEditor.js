// TodayEditor.js
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const TodayEditor = () => {
  const [content, setContent] = useState('');
  const [currentTextStyle, setCurrentTextStyle] = useState({
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false,
    fontSize: 16,
    color: '#000000',
    backgroundColor: 'transparent'
  });
  const [selectionStart, setSelectionStart] = useState(0);
  const [selectionEnd, setSelectionEnd] = useState(0);
  const [styledSegments, setStyledSegments] = useState([]);
  const [isDecorationMode, setIsDecorationMode] = useState(false);
  const [showStylePreview, setShowStylePreview] = useState(false);
  const textInputRef = useRef(null);

  // 오늘 날짜 생성 함수
  const getTodayDate = () => {
    const today = new Date();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    const weekdays = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
    const weekday = weekdays[today.getDay()];
    return `${month}월 ${day}일 ${weekday}`;
  };

  // 뒤로가기 버튼 핸들러
  const handleBackPress = () => {
    if (isDecorationMode) {
      setIsDecorationMode(false);
      setShowStylePreview(false);
    } else {
      console.log('뒤로가기 버튼 클릭됨');
    }
  };

  // 작성 완료 버튼 핸들러
  const handleSavePress = () => {
    console.log('일기 저장:', content);
    console.log('스타일된 텍스트 세그먼트:', styledSegments);
  };

  // 꾸미기 모드 토글
  const toggleDecorationMode = () => {
    const newDecorationMode = !isDecorationMode;
    setIsDecorationMode(newDecorationMode);
    setShowStylePreview(false);
    
    if (newDecorationMode && textInputRef.current) {
      textInputRef.current.blur();
    }
  };

  // 스타일 미리보기 토글
  const toggleStylePreview = () => {
    setShowStylePreview(!showStylePreview);
  };

  // 텍스트 변경 핸들러
  const handleTextChange = (newText) => {
    if (isDecorationMode) {
      return;
    }
    setContent(newText);
  };

  // 선택된 텍스트에 스타일 적용
  const applyStyleToSelection = (styleProperty, styleValue) => {
    if (selectionStart === selectionEnd) {
      setCurrentTextStyle(prev => ({ ...prev, [styleProperty]: styleValue }));
      return;
    }

    const selectedText = content.slice(selectionStart, selectionEnd);
    
    // 기존 세그먼트에서 겹치는 영역 제거
    const filteredSegments = styledSegments.filter(segment => 
      !(segment.start < selectionEnd && segment.end > selectionStart)
    );

    // 새로운 스타일 세그먼트 생성
    const newSegment = {
      text: selectedText,
      start: selectionStart,
      end: selectionEnd,
      ...currentTextStyle,
      [styleProperty]: styleValue
    };

    setStyledSegments([...filteredSegments, newSegment]);
    setCurrentTextStyle(prev => ({ ...prev, [styleProperty]: styleValue }));

    // 스타일 적용 후 자동으로 미리보기 활성화
    if (!showStylePreview) {
      setShowStylePreview(true);
    }

    console.log(`${styleProperty} 적용됨:`, selectedText, styleValue);
  };

  // 텍스트 스타일 토글 함수들
  const toggleBold = () => {
    const newValue = !currentTextStyle.bold;
    applyStyleToSelection('bold', newValue);
  };

  const toggleItalic = () => {
    const newValue = !currentTextStyle.italic;
    applyStyleToSelection('italic', newValue);
  };

  const toggleUnderline = () => {
    const newValue = !currentTextStyle.underline;
    applyStyleToSelection('underline', newValue);
  };

  const toggleStrikethrough = () => {
    const newValue = !currentTextStyle.strikethrough;
    applyStyleToSelection('strikethrough', newValue);
  };

  const changeFontSize = (size) => {
    applyStyleToSelection('fontSize', size);
  };

  const changeTextColor = (color) => {
    applyStyleToSelection('color', color);
  };

  const changeBackgroundColor = (backgroundColor) => {
    applyStyleToSelection('backgroundColor', backgroundColor);
  };

  // 선택 영역 변경 핸들러
  const handleSelectionChange = (event) => {
    const { start, end } = event.nativeEvent.selection;
    setSelectionStart(start);
    setSelectionEnd(end);

    if (start !== end) {
      const selectedSegment = styledSegments.find(segment =>
        segment.start <= start && segment.end >= end
      );

      if (selectedSegment) {
        setCurrentTextStyle({
          bold: selectedSegment.bold || false,
          italic: selectedSegment.italic || false,
          underline: selectedSegment.underline || false,
          strikethrough: selectedSegment.strikethrough || false,
          fontSize: selectedSegment.fontSize || 16,
          color: selectedSegment.color || '#000000',
          backgroundColor: selectedSegment.backgroundColor || 'transparent'
        });
      }
    }
  };

  // 스타일이 적용된 텍스트 렌더링
  const renderStyledText = () => {
    if (styledSegments.length === 0) {
      return (
        <Text style={styles.styledText}>
          {content}
        </Text>
      );
    }

    const sortedSegments = [...styledSegments].sort((a, b) => a.start - b.start);
    const renderedElements = [];
    let currentIndex = 0;

    sortedSegments.forEach((segment, index) => {
      // 세그먼트 이전의 일반 텍스트
      if (currentIndex < segment.start) {
        renderedElements.push(
          <Text key={`text-${index}-before`} style={styles.styledText}>
            {content.slice(currentIndex, segment.start)}
          </Text>
        );
      }

      // 스타일이 적용된 세그먼트
      const segmentStyle = {
        fontWeight: segment.bold ? 'bold' : 'normal',
        fontStyle: segment.italic ? 'italic' : 'normal',
        textDecorationLine: (() => {
          const decorations = [];
          if (segment.underline) decorations.push('underline');
          if (segment.strikethrough) decorations.push('line-through');
          return decorations.length > 0 ? decorations.join(' ') : 'none';
        })(),
        fontSize: segment.fontSize || 16,
        color: segment.color || '#333333',
        backgroundColor: segment.backgroundColor === 'transparent' ? 'transparent' : segment.backgroundColor,
      };

      renderedElements.push(
        <Text key={`segment-${index}`} style={[styles.styledText, segmentStyle]}>
          {segment.text}
        </Text>
      );

      currentIndex = segment.end;
    });

    // 마지막 세그먼트 이후의 일반 텍스트
    if (currentIndex < content.length) {
      renderedElements.push(
        <Text key="text-final" style={styles.styledText}>
          {content.slice(currentIndex)}
        </Text>
      );
    }

    return <View style={styles.styledTextContainer}>{renderedElements}</View>;
  };

  // 툴바 컴포넌트들
  const ToolbarButton = ({ onPress, isActive, icon, style }) => (
    <TouchableOpacity
      style={[
        styles.toolbarButton,
        isActive && styles.toolbarButtonActive,
        style
      ]}
      onPress={onPress}
    >
      <Icon
        name={icon}
        size={20}
        color={isActive ? '#FFFFFF' : '#333333'}
      />
    </TouchableOpacity>
  );

  const ColorButton = ({ color, onPress, isActive }) => (
    <TouchableOpacity
      style={[
        styles.colorButton,
        { backgroundColor: color === 'transparent' ? '#FFFFFF' : color },
        color === 'transparent' && { borderStyle: 'dashed' },
        isActive && styles.colorButtonActive
      ]}
      onPress={onPress}
    />
  );

  const FontSizeButton = ({ size, onPress, isActive }) => (
    <TouchableOpacity
      style={[
        styles.fontSizeButton,
        isActive && styles.toolbarButtonActive
      ]}
      onPress={onPress}
    >
      <Text style={[
        styles.fontSizeText,
        { color: isActive ? '#FFFFFF' : '#333333' }
      ]}>
        {size}pt
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 25}
      >
        {/* 상단 헤더 */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <Icon 
              name={isDecorationMode ? "close" : "arrow-back"} 
              size={24} 
              color="#333333" 
            />
          </TouchableOpacity>
          <View style={styles.headerButtons}>
            {!isDecorationMode && content.length > 0 && (
              <TouchableOpacity 
                style={styles.decorationButton} 
                onPress={toggleDecorationMode}
              >
                <Icon name="format-paint" size={18} color="#FFFFFF" />
                <Text style={styles.decorationButtonText}>꾸미기</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.saveButton} onPress={handleSavePress}>
              <Text style={styles.saveButtonText}>작성 완료</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 날짜 표시 */}
        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>{getTodayDate()}</Text>
        </View>

        {/* 꾸미기 모드 컨트롤 */}
        {isDecorationMode && (
          <View style={styles.decorationControls}>
            <View style={styles.decorationInfo}>
              <Icon name="format-paint" size={16} color="#E57373" />
              <Text style={styles.decorationInfoText}>
                텍스트를 드래그하여 선택한 후 툴바로 스타일을 적용하세요
              </Text>
            </View>
            {styledSegments.length > 0 && (
              <TouchableOpacity 
                style={[styles.previewToggle, showStylePreview && styles.previewToggleActive]}
                onPress={toggleStylePreview}
              >
                <Icon 
                  name={showStylePreview ? "visibility-off" : "visibility"} 
                  size={16} 
                  color={showStylePreview ? "#FFFFFF" : "#E57373"} 
                />
                <Text style={[
                  styles.previewToggleText,
                  showStylePreview && styles.previewToggleTextActive
                ]}>
                  {showStylePreview ? "선택 모드" : "미리보기"}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* 선택된 텍스트 정보 */}
        {isDecorationMode && !showStylePreview && selectionStart !== selectionEnd && (
          <View style={styles.selectionInfo}>
            <Text style={styles.selectionText}>
              선택된 텍스트: "{content.slice(selectionStart, selectionEnd)}"
            </Text>
          </View>
        )}

        {/* 에디터 영역 */}
        <View style={[styles.editorContainer, isDecorationMode && styles.editorContainerDecoration]}>
          <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
            {isDecorationMode ? (
              showStylePreview ? (
                // 스타일 미리보기 모드
                <View style={styles.previewContainer}>
                  {renderStyledText()}
                </View>
              ) : (
                // 텍스트 선택 모드
                <TextInput
                  ref={textInputRef}
                  style={styles.decorationTextInput}
                  multiline
                  value={content}
                  onChangeText={handleTextChange}
                  onSelectionChange={handleSelectionChange}
                  textAlignVertical="top"
                  selectionColor="#E57373"
                  showSoftInputOnFocus={false}
                />
              )
            ) : (
              // 일반 입력 모드
              <TextInput
                ref={textInputRef}
                style={styles.textInput}
                multiline
                placeholder="오늘의 일기를 입력해주세요."
                placeholderTextColor="#999999"
                value={content}
                onChangeText={handleTextChange}
                textAlignVertical="top"
                selectionColor="#E57373"
              />
            )}
          </ScrollView>
        </View>

        {/* 툴바 - 꾸미기 모드에서만 표시 */}
        {isDecorationMode && (
          <View style={styles.toolbar}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.toolbarContent}>
              {/* 기본 서식 버튼들 */}
              <ToolbarButton
                icon="format-bold"
                isActive={currentTextStyle.bold}
                onPress={toggleBold}
              />
              <ToolbarButton
                icon="format-italic"
                isActive={currentTextStyle.italic}
                onPress={toggleItalic}
              />
              <ToolbarButton
                icon="format-underlined"
                isActive={currentTextStyle.underline}
                onPress={toggleUnderline}
              />
              <ToolbarButton
                icon="format-strikethrough"
                isActive={currentTextStyle.strikethrough}
                onPress={toggleStrikethrough}
              />

              {/* 구분선 */}
              <View style={styles.separator} />

              {/* 글자 크기 버튼들 */}
              <FontSizeButton
                size={12}
                isActive={currentTextStyle.fontSize === 12}
                onPress={() => changeFontSize(12)}
              />
              <FontSizeButton
                size={16}
                isActive={currentTextStyle.fontSize === 16}
                onPress={() => changeFontSize(16)}
              />
              <FontSizeButton
                size={20}
                isActive={currentTextStyle.fontSize === 20}
                onPress={() => changeFontSize(20)}
              />
              <FontSizeButton
                size={24}
                isActive={currentTextStyle.fontSize === 24}
                onPress={() => changeFontSize(24)}
              />

              {/* 구분선 */}
              <View style={styles.separator} />

              {/* 글자 색상 */}
              <Text style={styles.toolbarLabel}>A</Text>
              <ColorButton
                color="#000000"
                isActive={currentTextStyle.color === '#000000'}
                onPress={() => changeTextColor('#000000')}
              />
              <ColorButton
                color="#FF0000"
                isActive={currentTextStyle.color === '#FF0000'}
                onPress={() => changeTextColor('#FF0000')}
              />
              <ColorButton
                color="#0000FF"
                isActive={currentTextStyle.color === '#0000FF'}
                onPress={() => changeTextColor('#0000FF')}
              />
              <ColorButton
                color="#008000"
                isActive={currentTextStyle.color === '#008000'}
                onPress={() => changeTextColor('#008000')}
              />

              {/* 구분선 */}
              <View style={styles.separator} />

              {/* 텍스트 배경색 */}
              <Icon name="format-color-fill" size={16} color="#333333" style={styles.backgroundColorIcon} />
              <ColorButton
                color="transparent"
                isActive={currentTextStyle.backgroundColor === 'transparent'}
                onPress={() => changeBackgroundColor('transparent')}
              />
              <ColorButton
                color="#FFFF00"
                isActive={currentTextStyle.backgroundColor === '#FFFF00'}
                onPress={() => changeBackgroundColor('#FFFF00')}
              />
              <ColorButton
                color="#FFB6C1"
                isActive={currentTextStyle.backgroundColor === '#FFB6C1'}
                onPress={() => changeBackgroundColor('#FFB6C1')}
              />
              <ColorButton
                color="#90EE90"
                isActive={currentTextStyle.backgroundColor === '#90EE90'}
                onPress={() => changeBackgroundColor('#90EE90')}
              />
            </ScrollView>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    padding: 10,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  decorationButton: {
    backgroundColor: '#E57373',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  decorationButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 5,
  },
  saveButton: {
    backgroundColor: '#E57373',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  dateContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  dateText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E57373',
  },
  decorationControls: {
    backgroundColor: '#FFF5F5',
    borderBottomWidth: 1,
    borderBottomColor: '#FFE5E5',
  },
  decorationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  decorationInfoText: {
    fontSize: 14,
    color: '#E57373',
    marginLeft: 8,
    fontWeight: '500',
    flex: 1,
  },
  previewToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 10,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#E57373',
  },
  previewToggleActive: {
    backgroundColor: '#E57373',
  },
  previewToggleText: {
    fontSize: 12,
    color: '#E57373',
    marginLeft: 5,
    fontWeight: '500',
  },
  previewToggleTextActive: {
    color: '#FFFFFF',
  },
  selectionInfo: {
    paddingHorizontal: 20,
    paddingVertical: 5,
    backgroundColor: '#F0F0F0',
  },
  selectionText: {
    fontSize: 12,
    color: '#666666',
    fontStyle: 'italic',
  },
  editorContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  editorContainerDecoration: {
    paddingBottom: 100,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    color: '#333333',
    textAlignVertical: 'top',
    minHeight: 200,
    backgroundColor: 'transparent',
  },
  decorationTextInput: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    color: '#333333',
    textAlignVertical: 'top',
    minHeight: 200,
    backgroundColor: 'transparent',
  },
  previewContainer: {
    minHeight: 200,
    padding: 10,
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
  },
  styledTextContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  styledText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333333',
  },
  toolbar: {
    backgroundColor: '#F5F5F5',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingVertical: 8,
    minHeight: 60,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  toolbarContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  toolbarButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  toolbarButtonActive: {
    backgroundColor: '#E57373',
  },
  separator: {
    width: 1,
    height: 30,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 10,
  },
  fontSizeButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    marginRight: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  fontSizeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  colorButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 8,
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  colorButtonActive: {
    borderColor: '#E57373',
    borderWidth: 3,
  },
  toolbarLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginRight: 8,
  },
  backgroundColorIcon: {
    marginRight: 8,
  },
});

export default TodayEditor;
